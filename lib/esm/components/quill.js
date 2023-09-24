var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { EvaluateLater, IsObject, JournalTry } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
export class QuillElement extends CustomElement {
    constructor() {
        super();
        this.quill_ = null;
        this.mounting_ = false;
        this.mounted_ = false;
        this.modules_ = null;
        this.formats_ = null;
        this.sizes_ = null;
        this.prompts_ = null;
        this.activePrompts_ = null;
        this.activePrompt_ = '';
        this.eventHandlers_ = {};
        this.boundEvents_ = {};
        this.instanceWaiters_ = new Array();
        this.container = null;
        this.theme = 'snow';
        this.placeholder = '';
        this.defer = false;
        this.readonly = false;
        this.debug = false;
        this.onready = '';
        this.oneditorchange = '';
        this.ontextchange = '';
        this.onselectionchanges = '';
        this.onchanges = '';
    }
    UpdateModulesProperty(value) {
        this.modules_ = value;
    }
    UpdatePromptProperty(value) {
        this.WaitInstance().then(() => this.SetPrompt_(value));
    }
    UpdateResourcesProperty(value) {
        this.resources_ = value;
    }
    AddModule(key, value) {
        this.modules_ = (this.modules_ || this.GetDefaultModules());
        this.modules_[key] = value;
    }
    RemoveModule(key) {
        this.modules_ && delete this.modules_[key];
    }
    GetDefaultModules() {
        return {
            toolbar: false,
        };
    }
    AddToolbarItem(key, value) {
        this.modules_ = (this.modules_ || {});
        this.modules_.toolbar = (IsObject(this.modules_.toolbar) ? this.modules_.toolbar : {});
        this.modules_.toolbar[key] = value;
    }
    RemoveToolbarItem(key) {
        this.modules_ && IsObject(this.modules_.toolbar) && (delete this.modules_.toolbar[key]);
    }
    AddFormat(key, value) {
        this.formats_ = (this.formats_ || {});
        this.formats_[key] = value;
    }
    RemoveFormat(key) {
        this.formats_ && delete this.formats_[key];
    }
    AddSize(value) {
        this.sizes_ = (this.sizes_ || []);
        this.sizes_.push(...(Array.isArray(value) ? value : [value]));
    }
    AddPrompt(prompt) {
        this.prompts_ = (this.prompts_ || []);
        this.prompts_.push(prompt);
        prompt.Toggle(this.activePrompt_ === prompt.name);
    }
    RemovePrompt(prompt) {
        this.prompts_ && (this.prompts_ = this.prompts_.filter(p => (p !== prompt)));
        this.activePrompts_ && (this.activePrompts_ = this.activePrompts_.filter(p => (p !== prompt)));
    }
    SetActivePrompt(prompt) {
        this.WaitInstance().then(() => this.SetPrompt_(prompt));
    }
    ToggleActivePrompt(prompt) {
        this.WaitInstance().then(() => this.SetPrompt_((prompt === this.activePrompt_) ? '' : prompt));
    }
    GetActivePrompt() {
        return this.activePrompt_;
    }
    AddEventHandler(event, handler) {
        this.eventHandlers_[event] = (this.eventHandlers_[event] || []);
        this.eventHandlers_[event].push(handler);
        this.BindEvent_(event);
    }
    RemoveEventHandler(event, handler) {
        var _a;
        if (!this.eventHandlers_[event]) {
            return;
        }
        const handlers = this.eventHandlers_[event];
        handlers.splice(handlers.indexOf(handler), 1);
        if (handlers.length === 0) {
            (_a = this.quill_) === null || _a === void 0 ? void 0 : _a.off(event, this.boundEvents_[event]);
            delete this.boundEvents_[event];
        }
    }
    GetInstance() {
        return this.quill_;
    }
    WaitInstance() {
        return new Promise(resolve => {
            this.mounted_ ? resolve(this.quill_) : this.instanceWaiters_.push(() => resolve(this.quill_));
        });
    }
    Mount() {
        if (this.mounted_ || this.mounting_) {
            return;
        }
        this.mounting_ = true;
        this.LoadResources().then(() => {
            this.mounting_ = false;
            this.mounted_ = true;
            if (this.sizes_) {
                const Size = window['Quill'].import('attributors/style/size');
                Size.whitelist = this.sizes_;
                window['Quill'].register(Size, true);
            }
            this.quill_ = new window['Quill']((this.container || this), {
                theme: (this.theme || 'default'),
                modules: (this.modules_ || this.GetDefaultModules()),
                formats: (this.formats_ || undefined),
                placeholder: (this.placeholder || undefined),
                readOnly: this.readonly,
                debug: this.debug,
            });
            this.instanceWaiters_.splice(0).forEach(waiter => JournalTry(waiter));
            Object.keys(this.eventHandlers_).forEach(event => this.BindEvent_(event));
            const evaluate = (expression, contexts) => {
                expression && EvaluateLater({
                    componentId: this.componentId_,
                    contextElement: this,
                    expression,
                    disableFunctionCall: false,
                })(undefined, [], contexts);
            };
            const events = {
                oneditorchange: 'editor-change',
                ontextchange: 'text-change',
                onselectionchanges: 'selection-change',
            };
            Object.entries(events).forEach(([key, event]) => {
                if (!this[key] && !this.onchanges) {
                    return;
                }
                this.AddEventHandler(event, ({ event, eventArgs }) => {
                    evaluate(this[key], {
                        event: {
                            name: event,
                            args: eventArgs,
                        },
                    });
                    evaluate(this.onchanges, {
                        event: {
                            name: event,
                            args: eventArgs,
                        },
                    });
                });
            });
            evaluate(this.onready);
        });
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), postAttributesCallback);
        scope.AddPostProcessCallback(() => (!this.defer && this.Mount()));
        scope.AddUninitCallback(() => {
            this.quill_ && Object.keys(this.boundEvents_).forEach(event => this.quill_.off(event, this.boundEvents_[event]));
            this.quill_ = null;
            this.container = null;
        });
    }
    SetPrompt_(name) {
        if (!this.prompts_ || name === this.activePrompt_) {
            return;
        }
        this.activePrompt_ = name;
        this.activePrompts_ && this.activePrompts_.forEach(prompt => prompt.Toggle(false));
        this.activePrompts_ = this.prompts_.filter(prompt => (prompt.name === name));
        this.activePrompts_.forEach(prompt => prompt.Toggle(true));
    }
    BindEvent_(event) {
        var _a;
        if (!this.quill_ || (event in this.boundEvents_)) {
            return;
        }
        this.boundEvents_[event] = (...args) => {
            const instance = this.quill_;
            if (!instance) {
                return;
            }
            const hasFocus = instance.hasFocus(), format = { value: null }, getFormat = () => {
                format.value = (format.value || instance.getFormat());
                return format.value;
            };
            this.eventHandlers_[event].forEach(handler => handler({
                instance,
                focused: !!hasFocus,
                event,
                eventArgs: args,
                getFormat,
            }));
        };
        (_a = this.quill_) === null || _a === void 0 ? void 0 : _a.on(event, this.boundEvents_[event]);
    }
}
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], QuillElement.prototype, "container", void 0);
__decorate([
    Property({ type: 'string' })
], QuillElement.prototype, "theme", void 0);
__decorate([
    Property({ type: 'string' })
], QuillElement.prototype, "placeholder", void 0);
__decorate([
    Property({ type: 'boolean' })
], QuillElement.prototype, "defer", void 0);
__decorate([
    Property({ type: 'boolean' })
], QuillElement.prototype, "readonly", void 0);
__decorate([
    Property({ type: 'boolean' })
], QuillElement.prototype, "debug", void 0);
__decorate([
    Property({ type: 'string' })
], QuillElement.prototype, "onready", void 0);
__decorate([
    Property({ type: 'string' })
], QuillElement.prototype, "oneditorchange", void 0);
__decorate([
    Property({ type: 'string' })
], QuillElement.prototype, "ontextchange", void 0);
__decorate([
    Property({ type: 'string' })
], QuillElement.prototype, "onselectionchanges", void 0);
__decorate([
    Property({ type: 'string' })
], QuillElement.prototype, "onchanges", void 0);
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], QuillElement.prototype, "UpdateModulesProperty", null);
__decorate([
    Property({ type: 'string' })
], QuillElement.prototype, "UpdatePromptProperty", null);
__decorate([
    Property({ type: 'array', checkStoredObject: true })
], QuillElement.prototype, "UpdateResourcesProperty", null);
export function QuillElementCompact() {
    RegisterCustomElement(QuillElement, 'quill');
}
