import { FindAncestor, IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

import { IQuillElement } from "../types";

export class QuillContentElement extends CustomElement{
    protected hiddenInput_: HTMLInputElement | null = null;
    protected name_ = '';
    
    @Property({ type: 'object', checkStoredObject: true })
    public quill: IQuillElement | null = null;

    @Property({ type: 'string' })
    public UpdateNameProperty(value: string){
        this.name_ = value;
        this.hiddenInput_ && (this.hiddenInput_.name = value);
    }

    public constructor(){
        super({
            isTemplate: true,
            isHidden: true,
        });
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        this.hiddenInput_ = document.createElement('input');
        this.hiddenInput_.type = 'hidden';
        this.appendChild(this.hiddenInput_);
        
        this.SetNativeElement_(this.hiddenInput_);
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            this.hiddenInput_ && (this.hiddenInput_.name = this.name_);
            (this.quill || FindAncestor<IQuillElement>(this, ancestor => ('AddEventHandler' in ancestor)))?.AddEventHandler('text-change', ({ instance }) => {
                this.hiddenInput_ && (this.hiddenInput_.value = JSON.stringify(instance.getContents()));
            });
            postAttributesCallback && postAttributesCallback();
        });
    }
}

export function QuillContentElementCompact(){
    RegisterCustomElement(QuillContentElement, 'quill-content');
}
