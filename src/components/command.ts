import { FindAncestor, IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

import { IQuillElement } from "../types";

export class QuillCommandElement extends CustomElement{
    protected quill_: IQuillElement | null = null;
    protected value_: any = null;
    
    @Property({ type: 'object', checkStoredObject: true })
    public UpdateQuillProperty(value: IQuillElement | null){
        this.quill_ = value;
    }

    @Property({ type: 'string' })
    public name = '';

    @Property({ type: 'object', checkStoredObject: true })
    public UpdateValueProperty(value: any){
        if (value !== this.value_){
            this.value_ = value;
            this.quill_?.WaitInstance().then(instance => (this.name && instance?.format(this.name, (value || false))));
        }
    }

    public constructor(){
        super({
            isTemplate: true,
            isHidden: true,
        });
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            this.quill_ = (this.quill_ || FindAncestor<IQuillElement>(this, ancestor => ('WaitInstance' in ancestor)));
            this.quill_?.WaitInstance().then(instance => (this.name && instance?.format(this.name, (this.value_ || false))));
            postAttributesCallback && postAttributesCallback();
        });
    }
}

export function QuillCommandElementCompact(){
    RegisterCustomElement(QuillCommandElement, 'quill-command');
}
