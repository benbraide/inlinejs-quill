import { FindAncestor, IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

import { IQuillElement } from "../types";

export class QuillSizeElement extends CustomElement{
    @Property({ type: 'object', checkStoredObject: true })
    public quill: IQuillElement | null = null;

    @Property({ type: 'object', checkStoredObject: true })
    public value: string | Array<string> = '';

    public constructor(){
        super({
            isTemplate: true,
            isHidden: true,
        });
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            this.value && (this.quill || FindAncestor<IQuillElement>(this, ancestor => ('AddSize' in ancestor)))?.AddSize(this.value);
            postAttributesCallback && postAttributesCallback();
        });
    }
}

export function QuillSizeElementCompact(){
    RegisterCustomElement(QuillSizeElement, 'quill-size');
}
