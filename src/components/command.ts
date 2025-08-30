import { FindAncestor, IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

import { IQuillElement } from "../types";

export class QuillCommandElement extends CustomElement{
    protected value_: any = null;
    
    @Property({ type: 'object', checkStoredObject: true })
    public quill: IQuillElement | null = null;

    @Property({ type: 'string' })
    public name = '';

    @Property({ type: 'json', checkStoredObject: true })
    public UpdateValueProperty(value: any){
        if (value !== this.value_){
            this.value_ = value;
            this.quill?.WaitInstance().then(instance => (this.name && instance?.format(this.name, (value || false))));
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
            this.quill = (this.quill || FindAncestor<IQuillElement>(this, ancestor => ('WaitInstance' in ancestor)));
            this.quill?.WaitInstance().then(instance => (this.name && instance?.format(this.name, (this.value_ || false))));
            postAttributesCallback && postAttributesCallback();
        });
    }
}

export function QuillCommandElementCompact(){
    RegisterCustomElement(QuillCommandElement, 'quill-command');
}
