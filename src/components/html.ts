import { FindAncestor, IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

import { IQuillElement } from "../types";

export class QuillHtmlElement extends CustomElement{
    protected codeBlock_: HTMLElement | null = null;
    
    @Property({ type: 'object', checkStoredObject: true })
    public quill: IQuillElement | null = null;

    public constructor(){
        super();
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        this.codeBlock_ = document.createElement('code');
        this.appendChild(this.codeBlock_);
        
        this.SetNativeElement_(this.codeBlock_);
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            (this.quill || FindAncestor<IQuillElement>(this, ancestor => ('AddEventHandler' in ancestor)))?.AddEventHandler('text-change', ({ instance }) => {
                this.OutputHtml_(instance.root);
            });
            postAttributesCallback && postAttributesCallback();
        });
    }

    protected OutputHtml_(element: Element, pad = 0, refresh = true){
        if (!this.codeBlock_){
            return;
        }

        if (refresh){
            while (this.codeBlock_.firstChild){
                this.codeBlock_.removeChild(this.codeBlock_.firstChild);
            }
        }

        const tagName = element.tagName.toLowerCase(), generateTag = (close = false, tag = '') => {
            if (close){
                return `&lt;/${tagName}&gt;`;
            }

            const attributes = Array.from(element.attributes).map(({ name, value }) => `${name}="${value}"`).join(' ');
            return (attributes ? `&lt;${tag || tagName} ${attributes}&gt;` : `&lt;${tag || tagName}&gt;`);
            
        };

        const singleTags = ['br', 'hr', 'img', 'input', 'link', 'meta', 'param'];

        if (element.children.length > 0){
            !refresh && this.AddHtmlLine_(pad, generateTag());
            
            element.childNodes.forEach((child) => {
                if (child instanceof Element){
                    this.OutputHtml_(child, (pad + 1), false);
                }
                else{
                    this.AddHtmlLine_((pad + 1), (child.textContent || '').replace(/\s/g, '&nbsp;'));
                }
            });

            !refresh && !singleTags.includes(tagName) && this.AddHtmlLine_(pad, generateTag(true));
        }
        else if (!refresh){
            this.AddHtmlLine_(pad, (generateTag() + (element.textContent || '').replace(/\s/g, '&nbsp;') + (singleTags.includes(tagName) ? '' : generateTag(true))));
        }
        else{
            this.AddHtmlLine_(pad, (generateTag(false, 'p') + generateTag(true, 'p')));
        }
    }

    protected AddHtmlLine_(pad: number, value: string){
        if (!this.codeBlock_){
            return;
        }

        const div = document.createElement('div');
        div.innerHTML = (Array.from({ length: (pad * 2) }).map(() => '&nbsp;').join('') + value);
        this.codeBlock_.appendChild(div);
    }
}

export function QuillHtmlElementCompact(){
    RegisterCustomElement(QuillHtmlElement, 'quill-html');
}
