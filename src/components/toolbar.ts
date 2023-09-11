import { Quill } from "quill";

import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

import { IQuillElement, QuillEventHandlerType } from "../types";
import { EvaluateLater, FindAncestor, IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";

const QuillToolbarGroups = {
    size: ['small', 'large', 'huge'],
    align: ['center', 'right', 'justify'],
    list: ['ordered', 'bullet'],
    indent: ['indent', 'outdent'],
    header: [1, 2, 3, 4, 5, 6],
    script: ['sub', 'super'],
};

export class QuillToolbarElement extends CustomElement{
    protected quillInstance_: Quill | null = null;
    protected button_: HTMLButtonElement | null = null;

    protected value_: string | Array<string | number | boolean> = '';
    protected previousValue_: string | number | boolean | null = null;
    protected isActive_ = false;
    
    @Property({ type: 'object', checkStoredObject: true })
    public quill: IQuillElement | null = null;

    @Property({ type: 'string' })
    public name = '';

    @Property({ type: 'object', checkStoredObject: true })
    public UpdateValueProperty(value: string | Array<string | number | boolean>){
        if (typeof value === 'string' && value.startsWith('group:') && value.substring(6) in QuillToolbarGroups){//E.g. group:header
            this.value_ = QuillToolbarGroups[value.substring(6)];
        }
        else{
            this.value_ = value;
        }
    }

    @Property({ type: 'boolean' })
    public toggle = false;

    @Property({ type: 'string' })
    public onactive = '';

    public constructor(){
        super();
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        this.button_ = document.createElement('button');
        this.appendChild(this.button_);
        this.button_.addEventListener('click', () => this.HandleClick_());
        
        this.SetNativeElement_(this.button_);
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            const listenForEditorChanges = (quill: IQuillElement) => {
                const handler: QuillEventHandlerType = ({ focused, getFormat }) => this.UpdateActive_(focused, getFormat);
                quill.AddEventHandler('editor-change', handler);
            };
            
            const quill = (this.quill || FindAncestor<IQuillElement>(this, ancestor => ('WaitInstance' in ancestor)));
            if (quill){//Search tree for quill element
                quill.WaitInstance().then((instance) => {
                    this.quillInstance_ = instance;
                    this.EvaluateOnActive_();
                });
                
                listenForEditorChanges(quill);
            }

            postAttributesCallback && postAttributesCallback();
        });

        scope.AddUninitCallback(() => {
            this.button_ = null;
            this.quill = null;
        });
    }

    protected HandleClick_(){
        if (!this.quillInstance_){
            return;
        }

        const update = () => queueMicrotask(() => this.UpdateActive_());
        if (this.toggle){
            this.quillInstance_.format(this.name, !this.isActive_);
            update();
        }
        else if (!this.value_){
            this.quillInstance_.format(this.name, false);
            update();
        }
        else if (!Array.isArray(this.value_)){
            this.quillInstance_.format(this.name, (this.isActive_ ? false : this.value_));
            update();
        }
    }

    protected UpdateActive_(focused?: boolean, getFormat?: () => Record<string, any>){
        focused = ((focused === undefined) ? this.quillInstance_?.hasFocus() : focused);
        if (!focused){
            return;
        }
        
        const format = (getFormat ? getFormat() : this.quillInstance_?.getFormat());
        if (!format){
            return;
        }
        
        if (this.toggle){
            this.ToggleActive_(!!format[this.name]);
        }
        else if (typeof this.value_ === 'string'){
            this.ToggleActive_(format[this.name] === ((typeof format[this.name] === 'number') ? parseFloat(this.value_) : this.value_));
        }
        else{//Array
            this.ToggleActive_(this.value_.includes(format[this.name]), format[this.name]);
        }
    }

    protected ToggleActive_(active: boolean, value?: any){
        if (active != this.isActive_ || (Array.isArray(this.value_) && value !== this.previousValue_)){
            this.isActive_ = active;
            this.previousValue_ = value;
            this.EvaluateOnActive_(value);
        }
    }

    protected EvaluateOnActive_(value?: any){
        this.onactive && EvaluateLater({
            componentId: this.componentId_,
            contextElement: this,
            expression: this.onactive,
            disableFunctionCall: false,
        })(undefined, [], {
            state: {
                active: this.isActive_,
                value: (this.isActive_ ? (value || this.value_) : undefined),
            },
        });
    }
}

export function QuillToolbarElementCompact(){
    RegisterCustomElement(QuillToolbarElement, 'quill-toolbar');
}
