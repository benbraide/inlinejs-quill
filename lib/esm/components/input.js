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
import { EvaluateLater, FindAncestor, RandomString } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
export class QuillInputElement extends CustomElement {
    constructor() {
        super();
        this.quillNativeElements_ = {};
        this.items_ = new Array();
        this.expandedItems_ = null;
        this.className_ = '';
        this.value_ = '';
        this.file_ = null;
        this.confirmationHandler_ = null;
        this.theme = null;
        this.items = null;
        this.placeholder = '';
        this.oncustomvaluechange = '';
    }
    AddNativeElement(element) {
        const type = (element.getAttribute('type') || '').toLowerCase();
        if (type) {
            if (!(type in this.quillNativeElements_)) {
                this.quillNativeElements_[type] = new Array();
            }
            this.quillNativeElements_[type].push(element);
        }
        else {
            super.AddNativeElement(element);
        }
    }
    RemoveNativeElement(element) {
        Object.entries(this.quillNativeElements_).forEach(([type, elements]) => {
            this.quillNativeElements_[type] = elements.filter(item => (item !== element));
        });
        super.RemoveNativeElement(element);
    }
    GetItems() {
        return this.items_;
    }
    Reset() {
        this.items_.forEach(item => (item.value = ''));
        this.file_ = null;
        this.value_ = '';
    }
    SetConfirmationHandler(handler) {
        this.confirmationHandler_ = handler;
    }
    GetDefaultTheme() {
        return {
            width: '100%',
            paddingTop: '0.5rem',
            paddingRight: '1rem',
            paddingBottom: '0.5rem',
            paddingLeft: '1rem',
            textColor: 'rgb(55, 65, 81)',
            backgroundColor: 'rgb(243, 244, 246)',
            fontSize: '0.875rem',
            fontWeight: '600',
            borderColor: 'rgb(229, 231, 235)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '0.375rem',
            focusBorderColor: 'rgb(29, 78, 216)',
            placeholderColor: '#9ca3af',
        };
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var _b;
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        (_b = FindAncestor(this, ancestor => ('AddQuillInput' in ancestor))) === null || _b === void 0 ? void 0 : _b.AddQuillInput(this);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            this.CreateStyleElement_();
            this.className_ && this.classList.add(this.className_);
            this.CreateInputElements_();
            const availableInputs = [...this.items_];
            const findAndUseInput = (predicate) => {
                const index = availableInputs.findIndex(predicate);
                if (index > -1) {
                    const [input] = availableInputs.splice(index, 1);
                    return input;
                }
                return null;
            };
            // Process typed native elements first
            Object.entries(this.quillNativeElements_).forEach(([type, elements]) => {
                elements.forEach(nativeEl => {
                    const input = findAndUseInput(item => item.type.toLowerCase() === type);
                    if (input) {
                        this.nativeElement_ = input;
                        this.CopyNativeElements_(nativeEl);
                    }
                });
            });
            // Process typeless native elements with the remaining available inputs
            this.nativeElements_.forEach(nativeEl => {
                const input = findAndUseInput(() => true); // Get the next available input
                if (input) {
                    this.nativeElement_ = input;
                    this.CopyNativeElements_(nativeEl);
                }
            });
            this.nativeElement_ = null;
            postAttributesCallback && postAttributesCallback();
        });
    }
    CreateStyleElement_() {
        if (this.className_ || this.theme === 'none') {
            return;
        }
        const theme = Object.assign({}, this.GetDefaultTheme(), (((typeof this.theme === 'string') ? null : this.theme) || {}));
        this.className_ = `quill-input-${RandomString(8)}`;
        const style = document.createElement('style');
        style.innerHTML = `
            .${this.className_}{
                width: ${theme.width};
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                color: ${theme.textColor};
                background-color: ${theme.backgroundColor};
                font-size: ${theme.fontSize};
                font-weight: ${theme.fontWeight};
                border-color: ${theme.borderColor};
                border-width: ${theme.borderWidth};
                border-style: ${theme.borderStyle};
                border-radius: ${theme.borderRadius};
                overflow: hidden;
            }

            .${this.className_}:focus-within{
                border-color: ${theme.focusBorderColor};
            }

            .${this.className_} input{
                width: 100%;
                padding-top: ${theme.paddingTop};
                padding-right: ${theme.paddingRight};
                padding-bottom: ${theme.paddingBottom};
                padding-left: ${theme.paddingLeft};
                color: inherit;
                background-color: inherit;
                font-size: inherit;
                font-weight: inherit;
                border: none;
                outline: none;
            }
            
            .${this.className_} input::placeholder{
                color: ${theme.placeholderColor};
            }

            .${this.className_} input + input{
                border-top-color: ${theme.borderColor};
                border-top-width: ${theme.borderWidth};
                border-top-style: ${theme.borderStyle};
            }
        `;
        document.head.appendChild(style);
    }
    CreateInputElements_() {
        this.ExpandItems_();
        (this.expandedItems_ || ['text']).forEach((item) => {
            const input = document.createElement('input');
            if (typeof item !== 'string') {
                input.type = item.type;
                input.placeholder = (item.placeholder || this.placeholder);
                item.value && (input.value = item.value);
                item.attributes && Object.entries(item.attributes).forEach(([key, value]) => {
                    input.setAttribute(key, ((typeof value === 'string') ? value : key));
                });
            }
            else {
                input.type = item;
                input.placeholder = this.placeholder;
            }
            this.items_.push(input);
            this.appendChild(input);
            const isFile = (input.type.toLowerCase() === 'file'), getValue = () => (this.file_ ? URL.createObjectURL(this.file_) : this.value_);
            input.addEventListener((isFile ? 'change' : 'input'), () => {
                if (isFile && input.files && input.files.length) {
                    this.file_ = input.files[0];
                    this.value_ = '';
                }
                else {
                    this.file_ = null;
                    this.value_ = (isFile ? '' : input.value);
                }
                this.items_.forEach(item => ((item !== input) && (item.value = '')));
                this.oncustomvaluechange && EvaluateLater({
                    componentId: this.componentId_,
                    contextElement: this,
                    expression: this.oncustomvaluechange,
                    disableFunctionCall: false,
                })(undefined, [], {
                    details: {
                        file: this.file_,
                        get value() {
                            return getValue();
                        }
                    },
                });
            });
            input.addEventListener('keydown', (event) => {
                if (event.key && event.key.toLowerCase() === 'enter' && this.confirmationHandler_) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.confirmationHandler_();
                }
            });
        });
    }
    ExpandItems_() {
        if (!this.items) {
            return;
        }
        let items = new Array();
        this.items.forEach((item) => {
            if (item === 'attachment') {
                items.push({
                    type: 'text',
                    placeholder: 'Attachment URL',
                    attributes: { readonly: true },
                });
                items.push({
                    type: 'file',
                    attributes: { accept: '.rar,.zip,.pdf,.docx,.txt,image/*' },
                });
            }
            else if (item === 'image') {
                items.push({
                    type: 'text',
                    placeholder: 'Image URL',
                });
                items.push({
                    type: 'file',
                    attributes: { accept: 'image/*' },
                });
            }
            else if (item === 'video') {
                items.push({
                    type: 'text',
                    placeholder: 'Video URL',
                });
                items.push({
                    type: 'file',
                    attributes: { accept: 'video/*' },
                });
            }
            else if (item === 'color' || item === 'background') {
                items.push({
                    type: 'text',
                    placeholder: 'Color name, hex, rgb, or hsl',
                });
                items.push({
                    type: 'color',
                });
            }
            else {
                items.push(item);
            }
        });
        this.expandedItems_ = items;
    }
}
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], QuillInputElement.prototype, "theme", void 0);
__decorate([
    Property({ type: 'array', checkStoredObject: true })
], QuillInputElement.prototype, "items", void 0);
__decorate([
    Property({ type: 'string' })
], QuillInputElement.prototype, "placeholder", void 0);
__decorate([
    Property({ type: 'string' })
], QuillInputElement.prototype, "oncustomvaluechange", void 0);
export function QuillInputElementCompact() {
    RegisterCustomElement(QuillInputElement, 'quill-input');
}
