"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuillDirectiveHandlerCompact = exports.QuillDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.QuillDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('quill', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if ((0, inlinejs_1.BindEvent)({ contextElement, expression,
        component: (component || componentId),
        key: 'quill',
        event: argKey,
        defaultEvent: 'ready',
        eventWhitelist: ['done'],
        options: argOptions,
        optionBlacklist: ['window', 'document', 'outside'],
    })) {
        return;
    }
    let resolvedComponent = (component || (0, inlinejs_1.FindComponentById)(componentId));
    if (!resolvedComponent) {
        return (0, inlinejs_1.JournalError)('Failed to retrieve element scope.', 'x-quill', contextElement);
    }
    // let bindPrompt = (action: string, defaultValue = '') => {
    //     let input = contextElement.querySelector('input'), onEvent = (e: Event) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         try{
    //             details.quillInstance?.format(action, input!.value);
    //         }
    //         catch{}
    //         input!.value = defaultValue;
    //         contextElement.dispatchEvent(new CustomEvent(`${QuillDirectiveName}.done`));
    //     };
    //     if (input){
    //         input.value = defaultValue;
    //         input.addEventListener('keydown', (e) => {
    //             if (e.key === 'Enter'){
    //                 onEvent(e);
    //             }
    //         });
    //         contextElement.querySelector('button')?.addEventListener('click', onEvent);
    //     }
    // };
    const quillKey = '$quill';
    let options = (0, inlinejs_1.ResolveOptions)({
        options: {
            manual: false,
            readonly: false,
            snow: false,
            bubble: false,
        },
        list: argOptions,
    });
    const getEventHandlers = (event) => (state.eventHandlers[event] = (state.eventHandlers[event] || []));
    const bindEvent = (event) => {
        var _a;
        state.boundEvents[event] = () => {
            var _a;
            let hasFocus = (_a = state.instance) === null || _a === void 0 ? void 0 : _a.hasFocus();
            state.instance && getEventHandlers(event).forEach(handler => handler(state.instance, !!hasFocus));
        };
        (_a = state.instance) === null || _a === void 0 ? void 0 : _a.on(event, state.boundEvents[event]);
    };
    let state = {
        theme: (options.snow ? 'snow' : (options.bubble ? 'bubble' : 'default')),
        modules: {
            toolbar: false,
        },
        instance: null,
        container: null,
        eventHandlers: {},
        boundEvents: {},
        dev: {
            setTheme(value) {
                state.theme = value;
            },
            addModule(key, value) {
                state.modules[key] = value;
            },
            removeModule(key) {
                delete state.modules[key];
            },
            addToolbarItem(key, value) {
                state.modules.toolbar = ((0, inlinejs_1.IsObject)(state.modules.toolbar) ? state.modules.toolbar : {});
                state.modules.toolbar[key] = value;
            },
            removeToolbarItem(key) {
                (0, inlinejs_1.IsObject)(state.modules.toolbar) && delete state.modules.toolbar[key];
            },
            replaceToolbarItem(value) {
                state.modules.toolbar = value;
            },
            addEventListener(event, handler) {
                getEventHandlers(event).push(handler);
                (state.instance && !state.boundEvents.hasOwnProperty(event)) && bindEvent(event);
            },
            removeEventListener(event, handler) {
                var _a;
                let handlers = getEventHandlers(event);
                handlers.splice(handlers.indexOf(handler), 1);
                if (state.boundEvents.hasOwnProperty(event) && handlers.length === 0) {
                    (_a = state.instance) === null || _a === void 0 ? void 0 : _a.off(event, state.boundEvents[event]);
                    delete state.boundEvents[event];
                }
            },
            setContainer(el) {
                state.container = el;
            },
            addUrl(url) {
                state.urls = (state.urls || []);
                state.urls.push(...(Array.isArray(url) ? url : [url]));
            },
            bind() {
                let resourceConcept = (0, inlinejs_1.GetGlobal)().GetConcept('resource');
                if (resourceConcept && state.urls) {
                    resourceConcept.Get({
                        items: state.urls,
                        concurrent: true,
                    }).then(init);
                }
                else {
                    init();
                }
            },
        },
        urls: null,
        ready: false,
    };
    let elementScope = resolvedComponent.CreateElementScope(contextElement), init = () => {
        if (state.ready || !state.container || typeof window['Quill'] !== 'function') {
            return;
        }
        state.instance = new (window['Quill'])(state.container, {
            modules: state.modules,
            theme: state.theme,
            readOnly: options.readonly,
        });
        state.ready = true;
        Object.keys(state.eventHandlers).forEach(event => bindEvent(event)); //Bind all events.
        contextElement.dispatchEvent(new CustomEvent('quill.ready'));
    };
    elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal(quillKey, {
        get root() {
            return this;
        },
        get parent() {
            return null;
        },
        get instance() {
            return state.instance;
        },
        get element() {
            return contextElement;
        },
        get container() {
            return state.container;
        },
        get theme() {
            return state.theme;
        },
        get dev() {
            return state.dev;
        },
        get isReady() {
            return state.ready;
        },
        set container(value) {
            state.dev.setContainer(value);
        },
        set theme(value) {
            state.dev.setTheme(value);
        },
        addUrl(url) {
            state.dev.addUrl(url);
        },
        bind() {
            state.dev.bind();
        },
    });
    elementScope === null || elementScope === void 0 ? void 0 : elementScope.AddUninitCallback(() => {
        if (state.instance) {
            Object.keys(state.boundEvents).forEach(event => state.instance.off(event, state.boundEvents[event]));
            state.instance = null;
        }
        state.modules.toolbar = null;
        state.modules = null;
        state.container = null;
        state.dev = null;
        state.eventHandlers = null;
        state.boundEvents = null;
        state.ready = false;
        state = null;
    });
    (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression })((value) => {
        var _a, _b;
        if ((0, inlinejs_1.IsObject)(value)) {
            state.theme = (value.theme || state.theme);
            (0, inlinejs_1.IsObject)(value.modules) && (state.modules = Object.assign(Object.assign({}, state.modules), value.modules));
            state.modules.toolbar = (value.toolbar || state.modules.toolbar);
            state.dev.addUrl(Array.isArray(value.urls) ? value.urls : (value.urls ? [value.urls] : []));
            !options.manual && ((_b = (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddPostProcessCallback(() => state.dev.bind()));
        }
    });
});
function QuillDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.QuillDirectiveHandler);
}
exports.QuillDirectiveHandlerCompact = QuillDirectiveHandlerCompact;
