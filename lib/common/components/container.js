"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuillContainerElementCompact = exports.QuillContainerElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class QuillContainerElement extends inlinejs_element_1.CustomElement {
    constructor() {
        super();
    }
    HandleElementScopeCreated_(params, postAttributesCallback) {
        super.HandleElementScopeCreated_(params, () => {
            const ancestor = (0, inlinejs_1.FindAncestor)(this, ancestor => ('container' in ancestor));
            ancestor && (ancestor.container = this);
            postAttributesCallback && postAttributesCallback();
        });
    }
}
exports.QuillContainerElement = QuillContainerElement;
function QuillContainerElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(QuillContainerElement, 'quill-container');
}
exports.QuillContainerElementCompact = QuillContainerElementCompact;
