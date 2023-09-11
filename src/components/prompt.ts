import { EvaluateLater, FindAncestor, IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement, NativeElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

import { IQuillElement, IQuillInput, IQuillInputTarget, IQuillPrompt } from "../types";

export class QuillPromptElement extends CustomElement implements IQuillPrompt, IQuillInputTarget{
    protected inputs_ = new Array<IQuillInput>();

    protected display_ = '';
    protected shown_ = true;
    
    @Property({ type: 'object', checkStoredObject: true })
    public quill: IQuillElement | null = null;

    @Property({ type: 'string' })
    public name = '';

    @Property({ type: 'string' })
    public onsave = '';

    @Property({ type: 'string' })
    public ondismiss = '';

    @Property({ type: 'boolean' })
    public persist = false;

    @Property({ type: 'boolean' })
    public toggle = false;

    @Property({ type: 'boolean' })
    public highlight = false;

    @Property({ type: 'boolean' })
    public button = false;

    public constructor(){
        super();
    }

    public Toggle(show: boolean){
        if (show == this.shown_){
            return;
        }
        
        this.shown_ = show;
        if (show){
            if (this.display_){
                this.style.display = this.display_;
            }
            else{
                this.style.removeProperty('display');
            }
            
            for (let input of this.inputs_){
                const items = input.GetItems();
                if (items.length > 0){
                    setTimeout(() => items[0].focus(), 0);
                    break;
                }
            }
        }
        else{
            this.display_ = this.style.display;
            this.style.display = 'none';
        }
    }

    public AddQuillInput(input: IQuillInput){
        this.inputs_.push(input);
    }

    public RemoveQuillInput(input: IQuillInput){
        const index = this.inputs_.indexOf(input);
        (index >= 0) && this.inputs_.splice(index, 1);
    }

    public Reset(){
        this.inputs_.forEach(input => input.Reset());
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        this.style.position = 'absolute';
        this.style.top = '0';
        this.style.left = '0';
        this.style.width = '100%';
        this.style.height = '100%';
        this.style.display = 'flex';
        this.style.flexDirection = 'row';
        this.style.justifyContent = 'center';
        this.style.alignItems = 'center';
        this.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
        ('backdropFilter' in (this.style as any)) && ((this.style as any).backdropFilter = 'blur(0.25rem)');
        this.style.cursor = 'text';
        this.style.overflow = 'hidden';
        
        this.nativeElement_ = document.createElement('form');

        this.nativeElement_.style.width = '50%';
        this.nativeElement_.style.display = 'flex';
        this.nativeElement_.style.flexDirection = 'row';
        this.nativeElement_.style.justifyContent = 'flex-start';
        this.nativeElement_.style.alignItems = 'flex-end';
        this.nativeElement_.style.padding = '1rem';
        this.nativeElement_.style.backgroundColor = 'white';
        this.nativeElement_.style.borderRadius = '0.375rem';
        // this.nativeElement_.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.6)';
        this.nativeElement_.style.overflow = 'hidden';
        
        this.appendChild(this.nativeElement_);
        Array.from(this.children).forEach((child) => {
            if (child !== this.nativeElement_ && !(child instanceof NativeElement)){
                child.remove();
                this.nativeElement_!.appendChild(child);
            }
        });

        this.nativeElement_.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();

            this.Toggle(false);
            this.onsave && EvaluateLater({
                componentId: this.componentId_,
                contextElement: this,
                expression: this.onsave,
                disableFunctionCall: false,
            })();

            !this.persist && this.Reset();

            const quill = (this.quill || FindAncestor<IQuillElement>(this, ancestor => ('AddPrompt' in ancestor)));
            
            this.toggle && quill?.ToggleActivePrompt(this.name);
            this.highlight && quill?.WaitInstance().then(instance => instance?.focus());
        });
        
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            if (this.button){
                const button = document.createElement('button');
                button.type = 'submit';
                button.textContent = 'Save';
    
                button.style.marginLeft = '0.5rem';
                button.style.padding = '0.5rem 1rem';
                button.style.backgroundColor = 'rgb(29, 78, 216)';
                button.style.color = 'white';
                button.style.fontSize = '0.875rem';
                button.style.fontWeight = '600';
                button.style.borderRadius = '0.375rem';
                button.style.border = 'none';
    
                this.nativeElement_?.appendChild(button);
            }

            (this.quill || FindAncestor<IQuillElement>(this, ancestor => ('AddPrompt' in ancestor)))?.AddPrompt(this);

            postAttributesCallback && postAttributesCallback();
        });

        this.addEventListener('click', (e) => {
            if (e.target !== this){
                return;
            }
            
            if (this.toggle){
                const quill = (this.quill || FindAncestor<IQuillElement>(this, ancestor => ('AddPrompt' in ancestor)));
                quill?.ToggleActivePrompt(this.name);
                quill?.WaitInstance().then(instance => instance?.focus());
            }
            else if (this.highlight){
                (this.quill || FindAncestor<IQuillElement>(this, ancestor => ('AddPrompt' in ancestor)))?.WaitInstance().then(instance => instance?.focus());
            }

            this.ondismiss && EvaluateLater({
                componentId: this.componentId_,
                contextElement: this,
                expression: this.ondismiss,
                disableFunctionCall: false,
            })();
        });
    }
}

export function QuillPromptElementCompact(){
    RegisterCustomElement(QuillPromptElement, 'quill-prompt');
}
