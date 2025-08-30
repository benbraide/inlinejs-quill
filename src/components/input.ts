import { EvaluateLater, FindAncestor, IElementScopeCreatedCallbackParams, RandomString } from "@benbraide/inlinejs";
import { CustomElement, INativeElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

import { IQuillInput, IQuillInputItem, IQuillInputTarget, IQuillInputTheme } from "../types";

export class QuillInputElement extends CustomElement implements IQuillInput{
    protected quillNativeElements_: Record<string, Array<INativeElement & HTMLElement>> = {};
    
    protected items_ = new Array<HTMLInputElement>();
    protected expandedItems_: Array<IQuillInputItem | string> | null = null;

    protected className_ = '';
    protected value_ = '';
    protected file_: File | null = null;

    protected confirmationHandler_: (() => void) | null = null;
    
    @Property({ type: 'object', checkStoredObject: true })
    public theme: IQuillInputTheme | string | null = null;

    @Property({ type: 'array', checkStoredObject: true })
    public items: Array<IQuillInputItem | string> | null = null;

    @Property({ type: 'string' })
    public placeholder = '';

    @Property({ type: 'string' })
    public oncustomvaluechange = '';

    public constructor(){
        super();
    }

    public AddNativeElement(element: INativeElement & HTMLElement){
        const type = (element.getAttribute('type') || '').toLowerCase();
        if (type){
            if (!(type in this.quillNativeElements_)){
                this.quillNativeElements_[type] = new Array<INativeElement & HTMLElement>();
            }

            this.quillNativeElements_[type].push(element);
        }
        else{
            super.AddNativeElement(element);
        }
    }

    public RemoveNativeElement(element: INativeElement){
        Object.entries(this.quillNativeElements_).forEach(([type, elements]) => {
            this.quillNativeElements_[type] = elements.filter(item => (item !== element));
        });
        super.RemoveNativeElement(element);
    }

    public GetItems(){
        return this.items_;
    }

    public Reset(){
        this.items_.forEach(item => (item.value = ''));
        this.file_ = null;
        this.value_ = '';
    }

    public SetConfirmationHandler(handler: (() => void) | null){
        this.confirmationHandler_ = handler;
    }

    public GetDefaultTheme(): IQuillInputTheme{
        return {
            width: '100%',
            paddingTop: '0.5rem',
            paddingRight: '1rem',
            paddingBottom: '0.5rem',
            paddingLeft: '1rem',
            textColor: 'rgb(55, 65, 81)',
            backgroundColor: 'rgb(243, 244, 246)',
            fontSize: '0.875rem',
            fontWeight: '600',
            borderColor: 'rgb(229, 231, 235)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '0.375rem',
            focusBorderColor: 'rgb(29, 78, 216)',
            placeholderColor: '#9ca3af',
        };
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        FindAncestor<IQuillInputTarget>(this, ancestor => ('AddQuillInput' in ancestor))?.AddQuillInput(this);
        
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            this.CreateStyleElement_();
            this.className_ && this.classList.add(this.className_);
            
            this.CreateInputElements_();

            const availableInputs = [...this.items_];
            const findAndUseInput = (predicate: (input: HTMLInputElement) => boolean): HTMLInputElement | null => {
                const index = availableInputs.findIndex(predicate);
                if (index > -1) {
                    const [input] = availableInputs.splice(index, 1);
                    return input;
                }
                return null;
            };

            // Process typed native elements first
            Object.entries(this.quillNativeElements_).forEach(([type, elements]) => {
                elements.forEach(nativeEl => {
                    const input = findAndUseInput(item => item.type.toLowerCase() === type);
                    if (input) {
                        this.nativeElement_ = input;
                        this.CopyNativeElements_(nativeEl);
                    }
                });
            });
            
            // Process typeless native elements with the remaining available inputs
            this.nativeElements_.forEach(nativeEl => {
                const input = findAndUseInput(() => true); // Get the next available input
                if (input) {
                    this.nativeElement_ = input;
                    this.CopyNativeElements_(nativeEl);
                }
            });
            
            this.nativeElement_ = null;
            postAttributesCallback && postAttributesCallback();
        });
    }

    protected CreateStyleElement_(){
        if (this.className_ || this.theme === 'none'){
            return;
        }

        const theme = Object.assign({}, this.GetDefaultTheme(), (((typeof this.theme === 'string') ? null : this.theme) || {}));
        this.className_ = `quill-input-${RandomString(8)}`;

        const style = document.createElement('style');
        style.innerHTML = `
            .${this.className_}{
                width: ${theme.width};
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                color: ${theme.textColor};
                background-color: ${theme.backgroundColor};
                font-size: ${theme.fontSize};
                font-weight: ${theme.fontWeight};
                border-color: ${theme.borderColor};
                border-width: ${theme.borderWidth};
                border-style: ${theme.borderStyle};
                border-radius: ${theme.borderRadius};
                overflow: hidden;
            }

            .${this.className_}:focus-within{
                border-color: ${theme.focusBorderColor};
            }

            .${this.className_} input{
                width: 100%;
                padding-top: ${theme.paddingTop};
                padding-right: ${theme.paddingRight};
                padding-bottom: ${theme.paddingBottom};
                padding-left: ${theme.paddingLeft};
                color: inherit;
                background-color: inherit;
                font-size: inherit;
                font-weight: inherit;
                border: none;
                outline: none;
            }
            
            .${this.className_} input::placeholder{
                color: ${theme.placeholderColor};
            }

            .${this.className_} input + input{
                border-top-color: ${theme.borderColor};
                border-top-width: ${theme.borderWidth};
                border-top-style: ${theme.borderStyle};
            }
        `;

        document.head.appendChild(style);
    }

    protected CreateInputElements_(){
        this.ExpandItems_();
        (this.expandedItems_ || ['text']).forEach((item) => {
            const input = document.createElement('input');
            if (typeof item !== 'string'){
                input.type = item.type;
                input.placeholder = (item.placeholder || this.placeholder);

                item.value && (input.value = item.value);
                item.attributes && Object.entries(item.attributes).forEach(([key, value]) => {//Copy attributes
                    input.setAttribute(key, ((typeof value === 'string') ? value : key));
                });
            }
            else{
                input.type = item;
                input.placeholder = this.placeholder;
            }

            this.items_.push(input);
            this.appendChild(input);

            const isFile = (input.type.toLowerCase() === 'file'), getValue = () => (this.file_ ? URL.createObjectURL(this.file_) : this.value_);
            input.addEventListener((isFile ? 'change' : 'input'), () => {
                if (isFile && input.files && input.files.length){
                    this.file_ = input.files[0];
                    this.value_ = '';
                }
                else{
                    this.file_ = null;
                    this.value_ = (isFile ? '' : input.value);
                }

                this.items_.forEach(item => ((item !== input) && (item.value = '')));

                this.oncustomvaluechange && EvaluateLater({
                    componentId: this.componentId_,
                    contextElement: this,
                    expression: this.oncustomvaluechange,
                    disableFunctionCall: false,
                })(undefined, [], {
                    details: {
                        file: this.file_,
                        get value(){
                            return getValue();
                        }
                    },
                });
            });

            input.addEventListener('keydown', (event) => {
                if (event.key && event.key.toLowerCase() === 'enter' && this.confirmationHandler_){
                    event.preventDefault();
                    event.stopPropagation();
                    this.confirmationHandler_();
                }
            });
        });
    }

    protected ExpandItems_(){
        if (!this.items){
            return;
        }

        let items = new Array<IQuillInputItem | string>();
        this.items.forEach((item) => {
            if (item === 'attachment'){
                items.push({
                    type: 'text',
                    placeholder: 'Attachment URL',
                    attributes: { readonly: true },
                });

                items.push({
                    type: 'file',
                    attributes: { accept: '.rar,.zip,.pdf,.docx,.txt,image/*' },
                });
            }
            else if (item === 'image'){
                items.push({
                    type: 'text',
                    placeholder: 'Image URL',
                });

                items.push({
                    type: 'file',
                    attributes: { accept: 'image/*' },
                });
            }
            else if (item === 'video'){
                items.push({
                    type: 'text',
                    placeholder: 'Video URL',
                });

                items.push({
                    type: 'file',
                    attributes: { accept: 'video/*' },
                });
            }
            else if (item === 'color' || item === 'background'){
                items.push({
                    type: 'text',
                    placeholder: 'Color name, hex, rgb, or hsl',
                });
                
                items.push({
                    type: 'color',
                });
            }
            else{
                items.push(item);
            }
        });

        this.expandedItems_ = items;
    }
}

export function QuillInputElementCompact(){
    RegisterCustomElement(QuillInputElement, 'quill-input');
}
