import { EvaluateLater, FindAncestor, IElementScopeCreatedCallbackParams, RandomString } from "@benbraide/inlinejs";
import { CustomElement, INativeElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

import { IQuillInput, IQuillInputItem, IQuillInputTarget, IQuillInputTheme } from "../types";

export class QuillInputElement extends CustomElement implements IQuillInput{
    protected quillNativeElements_: Record<string, Array<INativeElement & HTMLElement>> = {};
    
    protected items_ = new Array<HTMLInputElement>();
    protected expandedItems_: Array<IQuillInputItem | string> | null = null;

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
    public onvaluechange = '';

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
            this.classList.add(QuillInputElement.className);
            
            this.CreateInputElements_();

            let itemsByType: Record<string, Array<HTMLInputElement>> | null = null, sortItemsByType = () => {
                let items = {};
                for (let item of this.items_){
                    const type = item.type.toLowerCase();
                    !(type in items) && (items[type] = new Array<HTMLInputElement>());
                    items[type].push(item);
                }
                return items;
            };

            Object.entries(this.quillNativeElements_).forEach(([type, elements]) => {
                itemsByType = (itemsByType || sortItemsByType());
                if (!(type in itemsByType)){
                    return;
                }
                
                const items = itemsByType[type];
                for (let i = 0; i < elements.length; ++i){
                    if (i >= items.length){
                        break;
                    }

                    this.nativeElement_ = items[i];
                    this.CopyNativeElements_(elements[i]);
                }
            });
            
            for (let i = 1; i < this.nativeElements_.length; ++i){
                if (i >= this.items_.length){
                    break;
                }

                this.nativeElement_ = this.items_[i];
                this.CopyNativeElements_(this.nativeElements_[i]);
            }
            
            this.nativeElement_ = null;
            postAttributesCallback && postAttributesCallback();
        });
    }

    protected CreateStyleElement_(){
        if (QuillInputElement.className || this.theme === 'none'){
            return;
        }

        const theme = Object.assign({}, this.GetDefaultTheme(), (((typeof this.theme === 'string') ? null : this.theme) || {}));
        QuillInputElement.className = `quill-input-${RandomString(8)}`;

        const style = document.createElement('style');
        style.innerHTML = `
            .${QuillInputElement.className}{
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

            .${QuillInputElement.className}:focus-within{
                border-color: ${theme.focusBorderColor};
            }

            .${QuillInputElement.className} input{
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
            
            .${QuillInputElement.className} input::placeholder{
                color: ${theme.placeholderColor};
            }

            .${QuillInputElement.className} input + input{
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

                this.onvaluechange && EvaluateLater({
                    componentId: this.componentId_,
                    contextElement: this,
                    expression: this.onvaluechange,
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

    public static className = '';
}

export function QuillInputElementCompact(){
    RegisterCustomElement(QuillInputElement, 'quill-input');
}
