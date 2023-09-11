import { FindAncestor, IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

import { IQuillElement } from "../types";

export class QuillModuleElement extends CustomElement{
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
            (this.quill || FindAncestor<IQuillElement>(this, ancestor => ('AddModule' in ancestor)))?.AddModule(this.name, (this.value || true));
            postAttributesCallback && postAttributesCallback();
        });
    }
}

export function QuillModuleElementCompact(){
    RegisterCustomElement(QuillModuleElement, 'quill-module');
}
