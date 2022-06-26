import { FindComponentById, AddDirectiveHandler, CreateDirectiveHandlerCallback, GetGlobal, JournalError, AddChanges, BuildGetterProxyOptions, BuildProxyOptions, CreateInplaceProxy, BindEvent, ResolveOptions } from "@benbraide/inlinejs";
const QuillFieldGroups = {
    toggle: ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code'],
    size: ['size', 'small', 'normal', 'large', 'huge'],
    header: ['header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    align: ['align', 'left', 'center', 'right'],
    indent: ['indent', 'in', 'out'],
    list: ['list', 'bullet', 'ordered'],
    script: ['script', 'sub', 'super'],
    direction: ['direction', 'rtl'],
    prompts: ['link', 'image', 'video', 'color', 'background', 'font', 'indent'],
    mounts: ['container'],
};
let QuillUrl = '';
const QuillDirectiveName = 'quill';
export const QuillDirectiveHandler = CreateDirectiveHandlerCallback(QuillDirectiveName, ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if (BindEvent({ contextElement, expression,
        component: (component || componentId),
        key: QuillDirectiveName,
        event: argKey,
        defaultEvent: 'ready',
        eventWhitelist: ['done'],
        options: argOptions,
        optionBlacklist: ['window', 'document', 'outside'],
    })) {
        return;
    }
    let resolvedComponent = (component || FindComponentById(componentId)), elementScope = resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.FindElementScope(contextElement);
    if (!resolvedComponent || !elementScope) {
        return JournalError('Failed to retrieve element scope.', `InlineJS.${QuillDirectiveName}`, contextElement);
    }
    let localKey = `\$${QuillDirectiveName}`, detailsKey = `#${QuillDirectiveName}`;
    if (localKey in (elementScope.GetLocals() || {})) { //Already initialized
        return;
    }
    let groupKey = Object.keys(QuillFieldGroups).find(key => QuillFieldGroups[key].includes(argKey));
    if (groupKey) {
        let details = resolvedComponent.FindElementLocalValue(contextElement, detailsKey, true);
        if (!details) { //No parent
            return;
        }
        let addToolbarItem = (name, match, action) => {
            let bindPrompt = (action, defaultValue = '') => {
                var _a;
                let input = contextElement.querySelector('input'), onEvent = (e) => {
                    var _a;
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                        (_a = details.quillInstance) === null || _a === void 0 ? void 0 : _a.format(action, input.value);
                    }
                    catch (_b) { }
                    input.value = defaultValue;
                    contextElement.dispatchEvent(new CustomEvent(`${QuillDirectiveName}.done`));
                };
                if (input) {
                    input.value = defaultValue;
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            onEvent(e);
                        }
                    });
                    (_a = contextElement.querySelector('button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', onEvent);
                }
            };
            let prompt = (name.endsWith('.prompt') && name.substring(0, (name.length - '.prompt'.length)));
            if (prompt) { //Prompt handled
                return (!details.toolbar.hasOwnProperty(name) && bindPrompt(prompt, ((prompt === 'link') ? 'https://' : '')));
            }
            if (name === 'container') {
                return (!details.toolbar.hasOwnProperty(name) && (details.mounts.container = contextElement));
            }
            let id = resolvedComponent.GenerateUniqueId(`${QuillDirectiveName}_proxy_`), toolbarEntry = { id, name, action, match,
                element: contextElement,
                active: false,
            }, computedAction = (toolbarEntry.action || toolbarEntry.name);
            let toolbarEntryProxy = CreateInplaceProxy(BuildGetterProxyOptions({
                getter: (prop) => {
                    var _a, _b;
                    if (prop && toolbarEntry.hasOwnProperty(prop)) {
                        if (prop === 'active') {
                            (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                        }
                        return toolbarEntry[prop];
                    }
                    if (prop === 'parent') {
                        return (contextElement.parentElement ? (_b = FindComponentById(componentId)) === null || _b === void 0 ? void 0 : _b.FindElementLocalValue(contextElement.parentElement, localKey, true) : null);
                    }
                },
                lookup: [...Object.keys(toolbarEntry), 'parent'],
            }));
            if (details.toolbar.hasOwnProperty(name)) {
                let list = (Array.isArray(details.toolbar[name]) ? details.toolbar[name] : [details.toolbar[name]]);
                list.push(toolbarEntry);
                details.toolbar[name] = list;
            }
            else {
                details.toolbar[name] = toolbarEntry;
            }
            if (match) { //Bind listener
                contextElement.addEventListener('click', () => {
                    let isActive = toolbarEntry.active;
                    details.quillInstance.format(computedAction, (isActive ? false : toolbarEntry.match));
                    (Array.isArray(details.toolbar[name]) ? details.toolbar[name] : [details.toolbar[name]]).forEach((item) => {
                        var _a;
                        item.active = !isActive;
                        AddChanges('set', `${item.id}.active`, 'active', (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
                    });
                });
            }
            elementScope.AddUninitCallback(() => {
                if (Array.isArray(details.toolbar[name]) && details.toolbar[name].length > 1) {
                    details.toolbar[name].splice(details.toolbar[name].indexOf(toolbarEntry), 1);
                }
                else {
                    delete details.toolbar[name];
                }
            });
            elementScope.SetLocal(localKey, toolbarEntryProxy);
        };
        if (groupKey === 'toggle') {
            addToolbarItem(argKey, true, argKey);
        }
        else if (groupKey === 'prompts') {
            addToolbarItem(argOptions.includes('prompt') ? `${argKey}.prompt` : argKey);
        }
        else if (argKey === 'container') {
            addToolbarItem(argKey);
        }
        else if (argKey === groupKey) {
            addToolbarItem(groupKey);
        }
        else if (groupKey === 'indent') {
            addToolbarItem(`${groupKey}.${argKey}`, ((argKey === 'out') ? '-1' : '+1'), groupKey);
        }
        else { //Standard
            addToolbarItem(`${groupKey}.${argKey}`, argKey, groupKey);
        }
        return;
    }
    let options = ResolveOptions({
        options: {
            manual: false,
            readonly: false,
            snow: false,
        },
        list: argOptions,
    });
    let details = {
        quillInstance: null,
        toolbar: {},
        mounts: {
            container: null,
        },
    };
    let getFirstToolbarEntry = (entry) => (Array.isArray(entry) ? entry[0] : entry);
    let setActive = (name, value) => {
        var _a;
        let changes = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes;
        if (changes && details.toolbar.hasOwnProperty(name) && value != getFirstToolbarEntry(details.toolbar[name]).active) {
            let entry = details.toolbar[name];
            (Array.isArray(entry) ? entry : [entry]).forEach(item => {
                item.active = value;
                AddChanges('set', `${item.id}.active`, 'active', changes);
            });
        }
    };
    let onEditorChange = () => {
        if (!details.quillInstance.hasFocus()) {
            return;
        }
        let format = details.quillInstance.getFormat();
        Object.values(details.toolbar).forEach((entry) => {
            let isActive, firstEntry = getFirstToolbarEntry(entry), action = (firstEntry.action || firstEntry.name);
            if (action in format) {
                let value = ((action === 'indent') ? '+1' : format[action]);
                isActive = (firstEntry.match === null || firstEntry.match === undefined || firstEntry.match === value);
            }
            else {
                isActive = false;
            }
            setActive(firstEntry.name, isActive);
        });
    };
    let ready = false, init = () => {
        if (ready || !details.mounts.container || typeof window['Quill'] !== 'function') {
            return;
        }
        details.quillInstance = new window['Quill'](details.mounts.container, {
            modules: { toolbar: false },
            theme: (options.snow ? 'snow' : 'default'),
            readOnly: options.readonly,
        });
        details.quillInstance.on('editor-change', onEditorChange);
        ready = true;
        contextElement.dispatchEvent(new CustomEvent(`${QuillDirectiveName}.ready`));
    };
    elementScope.SetLocal(detailsKey, details);
    elementScope.SetLocal(localKey, CreateInplaceProxy(BuildProxyOptions({
        getter: (prop) => {
            if (prop === 'instance') {
                return details.quillInstance;
            }
            if (prop === 'container') {
                return details.mounts.container;
            }
            if (prop === 'bind') {
                return bind;
            }
            if (prop === 'url') {
                return QuillUrl;
            }
        },
        setter: (prop, value) => {
            if (prop === 'container' && !details.mounts.container) {
                details.mounts.container = value;
                if (!options.manual) {
                    init();
                }
            }
            if (prop === 'url') {
                QuillUrl = value;
            }
            return true;
        },
        lookup: ['instance', 'container', 'bind', 'url'],
    })));
    elementScope.AddUninitCallback(() => {
        if (details.quillInstance) {
            details.quillInstance.off('editor-change', onEditorChange);
            details.quillInstance = null;
        }
    });
    let bind = () => {
        let resourceConcept = GetGlobal().GetConcept('resource');
        if (QuillUrl && resourceConcept) {
            resourceConcept.Get({
                items: QuillUrl,
                concurrent: true,
            }).then(init);
        }
        else { //Resource not provided
            init();
        }
    };
    if (!options.manual) {
        bind();
    }
});
export function QuillDirectiveHandlerCompact() {
    AddDirectiveHandler(QuillDirectiveHandler);
}
