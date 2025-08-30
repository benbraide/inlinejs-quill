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
exports.QuillCommandElementCompact = exports.QuillCommandElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class QuillCommandElement extends inlinejs_element_1.CustomElement {
    constructor() {
        super({
            isTemplate: true,
            isHidden: true,
        });
        this.value_ = null;
        this.quill = null;
        this.name = '';
    }
    UpdateValueProperty(value) {
        var _a;
        if (value !== this.value_) {
            this.value_ = value;
            (_a = this.quill) === null || _a === void 0 ? void 0 : _a.WaitInstance().then(instance => (this.name && (instance === null || instance === void 0 ? void 0 : instance.format(this.name, (value || false)))));
        }
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            var _a;
            this.quill = (this.quill || (0, inlinejs_1.FindAncestor)(this, ancestor => ('WaitInstance' in ancestor)));
            (_a = this.quill) === null || _a === void 0 ? void 0 : _a.WaitInstance().then(instance => (this.name && (instance === null || instance === void 0 ? void 0 : instance.format(this.name, (this.value_ || false)))));
            postAttributesCallback && postAttributesCallback();
        });
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'object', checkStoredObject: true })
], QuillCommandElement.prototype, "quill", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], QuillCommandElement.prototype, "name", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'json', checkStoredObject: true })
], QuillCommandElement.prototype, "UpdateValueProperty", null);
exports.QuillCommandElement = QuillCommandElement;
function QuillCommandElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(QuillCommandElement, 'quill-command');
}
exports.QuillCommandElementCompact = QuillCommandElementCompact;
