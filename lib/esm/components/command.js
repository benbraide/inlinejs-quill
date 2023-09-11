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
import { FindAncestor } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
export class QuillCommandElement extends CustomElement {
    constructor() {
        super({
            isTemplate: true,
            isHidden: true,
        });
        this.quill_ = null;
        this.value_ = null;
        this.name = '';
    }
    UpdateQuillProperty(value) {
        this.quill_ = value;
    }
    UpdateValueProperty(value) {
        var _a;
        if (value !== this.value_) {
            this.value_ = value;
            (_a = this.quill_) === null || _a === void 0 ? void 0 : _a.WaitInstance().then(instance => (this.name && (instance === null || instance === void 0 ? void 0 : instance.format(this.name, (value || false)))));
        }
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            var _a;
            this.quill_ = (this.quill_ || FindAncestor(this, ancestor => ('WaitInstance' in ancestor)));
            (_a = this.quill_) === null || _a === void 0 ? void 0 : _a.WaitInstance().then(instance => (this.name && (instance === null || instance === void 0 ? void 0 : instance.format(this.name, (this.value_ || false)))));
            postAttributesCallback && postAttributesCallback();
        });
    }
}
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], QuillCommandElement.prototype, "UpdateQuillProperty", null);
__decorate([
    Property({ type: 'string' })
], QuillCommandElement.prototype, "name", void 0);
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], QuillCommandElement.prototype, "UpdateValueProperty", null);
export function QuillCommandElementCompact() {
    RegisterCustomElement(QuillCommandElement, 'quill-command');
}
