import { FindAncestor, IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement, RegisterCustomElement } from "@benbraide/inlinejs-element";
import { IQuillElement } from "../types";

export class QuillContainerElement extends CustomElement{
    public constructor(){
        super();
    }

    protected HandleElementScopeCreated_(params: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_(params, () => {
            const ancestor = FindAncestor<IQuillElement>(this, ancestor => ('container' in ancestor));
            ancestor && (ancestor.container = this);
            postAttributesCallback && postAttributesCallback();
        });
    }
}

export function QuillContainerElementCompact(){
    RegisterCustomElement(QuillContainerElement, 'quill-container');
}
