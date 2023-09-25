"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuillPromptElementCompact = exports.QuillPromptElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class QuillPromptElement extends inlinejs_element_1.CustomElement {
    constructor() {
        super();
        this.inputs_ = new Array();
        this.display_ = '';
        this.shown_ = true;
        this.quill = null;
        this.name = '';
        this.onsave = '';
        this.ondismiss = '';
        this.persist = false;
        this.toggle = false;
        this.highlight = false;
        this.button = false;
    }
    Toggle(show) {
        if (show == this.shown_) {
            return;
        }
        this.shown_ = show;
        if (show) {
            if (this.display_) {
                this.style.display = this.display_;
            }
            else {
                this.style.removeProperty('display');
            }
            for (let input of this.inputs_) {
                const items = input.GetItems();
                if (items.length > 0) {
                    setTimeout(() => items[0].focus(), 0);
                    break;
                }
            }
        }
        else {
            this.display_ = this.style.display;
            this.style.display = 'none';
        }
    }
    AddQuillInput(input) {
        this.inputs_.push(input);
        input.SetConfirmationHandler(() => this.Confirm());
    }
    RemoveQuillInput(input) {
        const index = this.inputs_.indexOf(input);
        (index >= 0) && this.inputs_.splice(index, 1);
    }
    Reset() {
        this.inputs_.forEach(input => input.Reset());
    }
    Confirm() {
        this.Toggle(false);
        this.onsave && (0, inlinejs_1.EvaluateLater)({
            componentId: this.componentId_,
            contextElement: this,
            expression: this.onsave,
            disableFunctionCall: false,
        })();
        !this.persist && this.Reset();
        const quill = (this.quill || (0, inlinejs_1.FindAncestor)(this, ancestor => ('AddPrompt' in ancestor)));
        this.toggle && (quill === null || quill === void 0 ? void 0 : quill.ToggleActivePrompt(this.name));
        this.highlight && (quill === null || quill === void 0 ? void 0 : quill.WaitInstance().then(instance => instance === null || instance === void 0 ? void 0 : instance.focus()));
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        this.style.position = 'absolute';
        this.style.top = '0';
        this.style.left = '0';
        this.style.width = '100%';
        this.style.height = '100%';
        this.style.display = 'flex';
        this.style.flexDirection = 'row';
        this.style.justifyContent = 'center';
        this.style.alignItems = 'center';
        this.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
        ('backdropFilter' in this.style) && (this.style.backdropFilter = 'blur(0.25rem)');
        this.style.cursor = 'text';
        this.style.overflow = 'hidden';
        this.nativeElement_ = document.createElement('div');
        this.nativeElement_.style.width = '50%';
        this.nativeElement_.style.display = 'flex';
        this.nativeElement_.style.flexDirection = 'row';
        this.nativeElement_.style.justifyContent = 'flex-start';
        this.nativeElement_.style.alignItems = 'flex-end';
        this.nativeElement_.style.padding = '1rem';
        this.nativeElement_.style.backgroundColor = 'white';
        this.nativeElement_.style.borderRadius = '0.375rem';
        // this.nativeElement_.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.6)';
        this.nativeElement_.style.overflow = 'hidden';
        this.appendChild(this.nativeElement_);
        Array.from(this.children).forEach((child) => {
            if (child !== this.nativeElement_ && !(child instanceof inlinejs_element_1.NativeElement)) {
                child.remove();
                this.nativeElement_.appendChild(child);
            }
        });
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            var _a, _b;
            if (this.button) {
                const button = document.createElement('button');
                button.type = 'button';
                button.textContent = 'Save';
                button.style.marginLeft = '0.5rem';
                button.style.padding = '0.5rem 1rem';
                button.style.backgroundColor = 'rgb(29, 78, 216)';
                button.style.color = 'white';
                button.style.fontSize = '0.875rem';
                button.style.fontWeight = '600';
                button.style.borderRadius = '0.375rem';
                button.style.border = 'none';
                (_a = this.nativeElement_) === null || _a === void 0 ? void 0 : _a.appendChild(button);
                button.addEventListener('click', () => this.Confirm());
            }
            (_b = (this.quill || (0, inlinejs_1.FindAncestor)(this, ancestor => ('AddPrompt' in ancestor)))) === null || _b === void 0 ? void 0 : _b.AddPrompt(this);
            postAttributesCallback && postAttributesCallback();
        });
        this.addEventListener('click', (e) => {
            var _a;
            if (e.target !== this) {
                return;
            }
            if (this.toggle) {
                const quill = (this.quill || (0, inlinejs_1.FindAncestor)(this, ancestor => ('AddPrompt' in ancestor)));
                quill === null || quill === void 0 ? void 0 : quill.ToggleActivePrompt(this.name);
                quill === null || quill === void 0 ? void 0 : quill.WaitInstance().then(instance => instance === null || instance === void 0 ? void 0 : instance.focus());
            }
            else if (this.highlight) {
                (_a = (this.quill || (0, inlinejs_1.FindAncestor)(this, ancestor => ('AddPrompt' in ancestor)))) === null || _a === void 0 ? void 0 : _a.WaitInstance().then(instance => instance === null || instance === void 0 ? void 0 : instance.focus());
            }
            this.ondismiss && (0, inlinejs_1.EvaluateLater)({
                componentId: this.componentId_,
                contextElement: this,
                expression: this.ondismiss,
                disableFunctionCall: false,
            })();
        });
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'object', checkStoredObject: true })
], QuillPromptElement.prototype, "quill", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], QuillPromptElement.prototype, "name", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], QuillPromptElement.prototype, "onsave", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], QuillPromptElement.prototype, "ondismiss", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], QuillPromptElement.prototype, "persist", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], QuillPromptElement.prototype, "toggle", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], QuillPromptElement.prototype, "highlight", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], QuillPromptElement.prototype, "button", void 0);
exports.QuillPromptElement = QuillPromptElement;
function QuillPromptElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(QuillPromptElement, 'quill-prompt');
}
exports.QuillPromptElementCompact = QuillPromptElementCompact;
