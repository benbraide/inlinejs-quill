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
export class QuillHtmlElement extends CustomElement {
    constructor() {
        super();
        this.codeBlock_ = null;
        this.quill = null;
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        this.codeBlock_ = document.createElement('code');
        this.codeBlock_.style.whiteSpace = 'pre-wrap';
        this.appendChild(this.codeBlock_);
        this.SetNativeElement_(this.codeBlock_);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            const quill = (this.quill || FindAncestor(this, ancestor => ('AddEventHandler' in ancestor)));
            quill === null || quill === void 0 ? void 0 : quill.WaitInstance().then((instance) => {
                instance && this.OutputHtml_(instance.root);
            });
            quill === null || quill === void 0 ? void 0 : quill.AddEventHandler('text-change', ({ instance }) => {
                this.OutputHtml_(instance.root);
            });
            postAttributesCallback && postAttributesCallback();
        });
    }
    OutputHtml_(element, pad = 0, refresh = true) {
        if (!this.codeBlock_) {
            return;
        }
        if (refresh) {
            this.codeBlock_.textContent = '';
        }
        const tagName = element.tagName.toLowerCase(), generateTag = (close = false, tag = '') => {
            if (close) {
                return `</${tagName}>`;
            }
            const attributes = Array.from(element.attributes).map(({ name, value }) => `${name}="${value}"`).join(' ');
            return (attributes ? `<${tag || tagName} ${attributes}>` : `<${tag || tagName}>`);
        };
        const singleTags = ['br', 'hr', 'img', 'input', 'link', 'meta', 'param'];
        if (element.children.length > 0) {
            !refresh && this.AddHtmlLine_(pad, generateTag());
            element.childNodes.forEach((child) => {
                if (child instanceof Element) {
                    this.OutputHtml_(child, (pad + 1), false);
                }
                else {
                    this.AddHtmlLine_((pad + 1), (child.textContent || ''));
                }
            });
            !refresh && !singleTags.includes(tagName) && this.AddHtmlLine_(pad, generateTag(true));
        }
        else if (!refresh) {
            this.AddHtmlLine_(pad, (generateTag() + (element.textContent || '') + (singleTags.includes(tagName) ? '' : generateTag(true))));
        }
        else {
            this.AddHtmlLine_(pad, '<p></p>');
        }
    }
    AddHtmlLine_(pad, value) {
        if (!this.codeBlock_) {
            return;
        }
        const line = `${' '.repeat(pad * 2)}${value}\n`;
        this.codeBlock_.appendChild(document.createTextNode(line));
    }
}
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], QuillHtmlElement.prototype, "quill", void 0);
export function QuillHtmlElementCompact() {
    RegisterCustomElement(QuillHtmlElement, 'quill-html');
}
