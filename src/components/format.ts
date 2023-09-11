import { FindAncestor, IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

import { IQuillElement } from "../types";

export class QuillFormatElement extends CustomElement{
    @Property({ type: 'object', checkStoredObject: true })
    public quill: IQuillElement | null = null;

    @Property({ type: 'string' })
    public name = '';

    @Property({ type: 'object', checkStoredObject: true })
    public value: any = null;

    public constructor(){
        super({
            isTemplate: true,
            isHidden: true,
        });
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            this.value && (this.quill || FindAncestor<IQuillElement>(this, ancestor => ('AddFormat' in ancestor)))?.AddFormat(this.name, this.value);
            postAttributesCallback && postAttributesCallback();
        });
    }
}

export function QuillFormatElementCompact(){
    RegisterCustomElement(QuillFormatElement, 'quill-format');
}
