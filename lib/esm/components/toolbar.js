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
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
import { EvaluateLater, FindAncestor } from "@benbraide/inlinejs";
const QuillToolbarGroups = {
    size: ['small', 'large', 'huge'],
    align: ['center', 'right', 'justify'],
    list: ['ordered', 'bullet'],
    indent: ['indent', 'outdent'],
    header: [1, 2, 3, 4, 5, 6],
    script: ['sub', 'super'],
};
export class QuillToolbarElement extends CustomElement {
    constructor() {
        super();
        this.quillInstance_ = null;
        this.button_ = null;
        this.value_ = '';
        this.previousValue_ = null;
        this.isActive_ = false;
        this.quill = null;
        this.name = '';
        this.toggle = false;
        this.oncustomactive = '';
    }
    UpdateValueProperty(value) {
        if (typeof value === 'string' && value.startsWith('group:') && value.substring(6) in QuillToolbarGroups) { //E.g. group:header
            this.value_ = QuillToolbarGroups[value.substring(6)];
        }
        else {
            this.value_ = value;
        }
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        this.button_ = document.createElement('button');
        this.button_.type = 'button';
        this.appendChild(this.button_);
        this.button_.addEventListener('click', () => this.HandleClick_());
        this.SetNativeElement_(this.button_);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            const listenForEditorChanges = (quill) => {
                const handler = ({ focused, getFormat }) => this.UpdateActive_(focused, getFormat);
                quill.AddEventHandler('editor-change', handler);
            };
            const quill = (this.quill || FindAncestor(this, ancestor => ('WaitInstance' in ancestor)));
            if (quill) { //Search tree for quill element
                quill.WaitInstance().then((instance) => {
                    this.quillInstance_ = instance;
                    this.EvaluateOnActive_();
                });
                listenForEditorChanges(quill);
            }
            postAttributesCallback && postAttributesCallback();
        });
        scope.AddUninitCallback(() => {
            this.button_ = null;
            this.quill = null;
        });
    }
    HandleClick_() {
        if (!this.quillInstance_) {
            return;
        }
        const update = () => queueMicrotask(() => this.UpdateActive_());
        if (this.toggle) {
            this.quillInstance_.format(this.name, !this.isActive_);
            update();
        }
        else if (!this.value_) {
            this.quillInstance_.format(this.name, false);
            update();
        }
        else if (!Array.isArray(this.value_) && this.value_ !== '*') {
            this.quillInstance_.format(this.name, (this.isActive_ ? false : this.value_));
            update();
        }
    }
    UpdateActive_(focused, getFormat) {
        var _a, _b;
        focused = ((focused === undefined) ? (_a = this.quillInstance_) === null || _a === void 0 ? void 0 : _a.hasFocus() : focused);
        if (!focused) {
            return;
        }
        const format = (getFormat ? getFormat() : (_b = this.quillInstance_) === null || _b === void 0 ? void 0 : _b.getFormat());
        if (!format) {
            return;
        }
        if (this.toggle || (typeof this.value_ === 'string' && this.value_ === '*')) { //Match any
            this.ToggleActive_(!!format[this.name]);
        }
        else if (typeof this.value_ === 'string') {
            let isActive = false;
            if (typeof format[this.name] === 'number') {
                isActive = (format[this.name] === parseFloat(this.value_));
            }
            else if (typeof format[this.name] === 'boolean') {
                isActive = (format[this.name] === (this.value_ === 'true'));
            }
            else {
                isActive = (format[this.name] === this.value_);
            }
            this.ToggleActive_(isActive);
        }
        else { //Array
            this.ToggleActive_(this.value_.includes(format[this.name]), format[this.name]);
        }
    }
    ToggleActive_(active, value) {
        if (active != this.isActive_ || (Array.isArray(this.value_) && value !== this.previousValue_)) {
            this.isActive_ = active;
            (value !== undefined) && (this.previousValue_ = value);
            this.EvaluateOnActive_(value);
        }
    }
    EvaluateOnActive_(value) {
        this.oncustomactive && EvaluateLater({
            componentId: this.componentId_,
            contextElement: this,
            expression: this.oncustomactive,
            disableFunctionCall: false,
        })(undefined, [], {
            state: {
                active: this.isActive_,
                value: (this.isActive_ ? (value || this.value_) : undefined),
            },
        });
    }
}
__decorate([
    Property({ type: 'json', checkStoredObject: true })
], QuillToolbarElement.prototype, "quill", void 0);
__decorate([
    Property({ type: 'string' })
], QuillToolbarElement.prototype, "name", void 0);
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], QuillToolbarElement.prototype, "UpdateValueProperty", null);
__decorate([
    Property({ type: 'boolean' })
], QuillToolbarElement.prototype, "toggle", void 0);
__decorate([
    Property({ type: 'string' })
], QuillToolbarElement.prototype, "oncustomactive", void 0);
export function QuillToolbarElementCompact() {
    RegisterCustomElement(QuillToolbarElement, 'quill-toolbar');
}
