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
exports.QuillSizeElementCompact = exports.QuillSizeElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class QuillSizeElement extends inlinejs_element_1.CustomElement {
    constructor() {
        super({
            isTemplate: true,
            isHidden: true,
        });
        this.quill = null;
        this.value = '';
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            var _a;
            this.value && ((_a = (this.quill || (0, inlinejs_1.FindAncestor)(this, ancestor => ('AddSize' in ancestor)))) === null || _a === void 0 ? void 0 : _a.AddSize(this.value));
            postAttributesCallback && postAttributesCallback();
        });
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'object', checkStoredObject: true })
], QuillSizeElement.prototype, "quill", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'object', checkStoredObject: true })
], QuillSizeElement.prototype, "value", void 0);
exports.QuillSizeElement = QuillSizeElement;
function QuillSizeElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(QuillSizeElement, 'quill-size');
}
exports.QuillSizeElementCompact = QuillSizeElementCompact;
