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
exports.QuillToolbarElementCompact = exports.QuillToolbarElement = void 0;
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const inlinejs_1 = require("@benbraide/inlinejs");
const QuillToolbarGroups = {
    size: ['small', 'large', 'huge'],
    align: ['center', 'right', 'justify'],
    list: ['ordered', 'bullet'],
    indent: ['indent', 'outdent'],
    header: [1, 2, 3, 4, 5, 6],
    script: ['sub', 'super'],
};
class QuillToolbarElement extends inlinejs_element_1.CustomElement {
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
        this.onactive = '';
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
        this.appendChild(this.button_);
        this.button_.addEventListener('click', () => this.HandleClick_());
        this.SetNativeElement_(this.button_);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            const listenForEditorChanges = (quill) => {
                const handler = ({ focused, getFormat }) => this.UpdateActive_(focused, getFormat);
                quill.AddEventHandler('editor-change', handler);
            };
            const quill = (this.quill || (0, inlinejs_1.FindAncestor)(this, ancestor => ('WaitInstance' in ancestor)));
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
        else if (!Array.isArray(this.value_)) {
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
        if (this.toggle) {
            this.ToggleActive_(!!format[this.name]);
        }
        else if (typeof this.value_ === 'string') {
            this.ToggleActive_(format[this.name] === ((typeof format[this.name] === 'number') ? parseFloat(this.value_) : this.value_));
        }
        else { //Array
            this.ToggleActive_(this.value_.includes(format[this.name]), format[this.name]);
        }
    }
    ToggleActive_(active, value) {
        if (active != this.isActive_ || (Array.isArray(this.value_) && value !== this.previousValue_)) {
            this.isActive_ = active;
            this.previousValue_ = value;
            this.EvaluateOnActive_(value);
        }
    }
    EvaluateOnActive_(value) {
        this.onactive && (0, inlinejs_1.EvaluateLater)({
            componentId: this.componentId_,
            contextElement: this,
            expression: this.onactive,
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
    (0, inlinejs_element_1.Property)({ type: 'object', checkStoredObject: true })
], QuillToolbarElement.prototype, "quill", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], QuillToolbarElement.prototype, "name", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'object', checkStoredObject: true })
], QuillToolbarElement.prototype, "UpdateValueProperty", null);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], QuillToolbarElement.prototype, "toggle", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], QuillToolbarElement.prototype, "onactive", void 0);
exports.QuillToolbarElement = QuillToolbarElement;
function QuillToolbarElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(QuillToolbarElement, 'quill-toolbar');
}
exports.QuillToolbarElementCompact = QuillToolbarElementCompact;
