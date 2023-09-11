import { FindAncestor } from "@benbraide/inlinejs";
import { CustomElement, RegisterCustomElement } from "@benbraide/inlinejs-element";
export class QuillContainerElement extends CustomElement {
    constructor() {
        super();
    }
    HandleElementScopeCreated_(params, postAttributesCallback) {
        super.HandleElementScopeCreated_(params, () => {
            const ancestor = FindAncestor(this, ancestor => ('container' in ancestor));
            ancestor && (ancestor.container = this);
            postAttributesCallback && postAttributesCallback();
        });
    }
}
export function QuillContainerElementCompact() {
    RegisterCustomElement(QuillContainerElement, 'quill-container');
}
