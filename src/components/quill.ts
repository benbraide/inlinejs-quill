import { Quill, StringMap } from "quill";

import { EvaluateLater, IElementScopeCreatedCallbackParams, IsObject, JournalTry } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

import { IQuillElement, IQuillPrompt, QuillEventHandlerType } from "../types";

export class QuillElement extends CustomElement implements IQuillElement{
    protected quill_: Quill | null = null;
    protected mounting_ = false;

    protected modules_: Record<string, any> | null = null;
    protected formats_: Record<string, any> | null = null;
    protected sizes_: Array<string> | null = null;

    protected prompts_: Array<IQuillPrompt> | null = null;
    protected activePrompts_: Array<IQuillPrompt> | null = null;
    protected activePrompt_ = '';

    protected eventHandlers_: Record<string, Array<QuillEventHandlerType>> = {};
    protected boundEvents_: Record<string, (...args: any[]) => void> = {};

    protected instanceWaiters_ = new Array<() => void>();

    @Property({ type: 'object', checkStoredObject: true })
    public container: HTMLElement | null = null;
    
    @Property({ type: 'string' })
    public theme = 'snow';

    @Property({ type: 'string' })
    public placeholder = '';

    @Property({ type: 'boolean' })
    public defer = false;

    @Property({ type: 'boolean' })
    public readonly = false;

    @Property({ type: 'boolean' })
    public debug = false;

    @Property({ type: 'string' })
    public onready = '';

    @Property({ type: 'string' })
    public oneditorchange = '';

    @Property({ type: 'string' })
    public ontextchange = '';

    @Property({ type: 'string' })
    public onselectionchanges = '';

    @Property({ type: 'string' })
    public onchanges = '';
    
    @Property({ type: 'object', checkStoredObject: true })
    public UpdateModulesProperty(value: Record<string, any>){
        this.modules_ = value;
    }

    @Property({ type: 'string' })
    public UpdatePromptProperty(value: string){
        this.WaitInstance().then(() => this.SetPrompt_(value));
    }

    @Property({ type: 'array', checkStoredObject: true })
    public UpdateResourcesProperty(value: Array<any>){
        this.resources_ = value;
    }

    public constructor(){
        super();
    }

    public AddModule(key: string, value: any){
        this.modules_ = (this.modules_ || this.GetDefaultModules());
        this.modules_[key] = value;
    }

    public RemoveModule(key: string){
        this.modules_ && delete this.modules_[key];
    }

    public GetDefaultModules(){
        return {
            toolbar: <Record<string, any> | boolean>false,
        };
    }

    public AddToolbarItem(key: string, value: any){
        this.modules_ = (this.modules_ || {});
        this.modules_.toolbar = (IsObject(this.modules_.toolbar) ? this.modules_.toolbar : {});
        this.modules_.toolbar[key] = value;
    }

    public RemoveToolbarItem(key: string){
        this.modules_ && IsObject(this.modules_.toolbar) && (delete this.modules_.toolbar[key]);
    }

    public AddFormat(key: string, value: any){
        this.formats_ = (this.formats_ || {});
        this.formats_[key] = value;
    }

    public RemoveFormat(key: string){
        this.formats_ && delete this.formats_[key];
    }

    public AddSize(value: string | Array<string>){
        this.sizes_ = (this.sizes_ || []);
        this.sizes_.push(...(Array.isArray(value) ? value : [value]));
    }

    public AddPrompt(prompt: IQuillPrompt){
        this.prompts_ = (this.prompts_ || []);
        this.prompts_.push(prompt);
        prompt.Toggle(this.activePrompt_ === prompt.name);
    }

    public RemovePrompt(prompt: IQuillPrompt){
        this.prompts_ && (this.prompts_ = this.prompts_.filter(p => (p !== prompt)));
        this.activePrompts_ && (this.activePrompts_ = this.activePrompts_.filter(p => (p !== prompt)));
    }

    public SetActivePrompt(prompt: string){
        this.WaitInstance().then(() => this.SetPrompt_(prompt));
    }

    public ToggleActivePrompt(prompt: string){
        this.WaitInstance().then(() => this.SetPrompt_((prompt === this.activePrompt_) ? '' : prompt));
    }

    public GetActivePrompt(){
        return this.activePrompt_;
    }

    public AddEventHandler(event: string, handler: QuillEventHandlerType){
        this.eventHandlers_[event] = (this.eventHandlers_[event] || []);
        this.eventHandlers_[event].push(handler);
        this.BindEvent_(event);
    }

    public RemoveEventHandler(event: string, handler: QuillEventHandlerType){
        if (!this.eventHandlers_[event]){
            return;
        }

        const handlers = this.eventHandlers_[event];
        handlers.splice(handlers.indexOf(handler), 1);

        if (handlers.length === 0){
            this.quill_?.off(<any>event, this.boundEvents_[event]);
            delete this.boundEvents_[event];
        }
    }

    public GetInstance(){
        return this.quill_;
    }

    public WaitInstance(){
        return new Promise<Quill | null>(resolve => {
            this.quill_ ? resolve(this.quill_) : this.instanceWaiters_.push(() => resolve(this.quill_));
        });
    }

    public Mount(){
        if (this.quill_ || this.mounting_){
            return;
        }

        this.mounting_ = true;
        this.LoadResources().then(() => {
            this.mounting_ = false;
            if (this.sizes_){
                const Size = window['Quill'].import('attributors/style/size');
                Size.whitelist = this.sizes_;
                window['Quill'].register(Size, true);
            }
            
            this.quill_ = new window['Quill']((this.container || this), {
                theme: (this.theme || 'default'),
                modules: (this.modules_ || this.GetDefaultModules()),
                formats: (this.formats_ || undefined),
                placeholder: (this.placeholder || undefined),
                readOnly: this.readonly,
                debug: this.debug,
            });

            this.instanceWaiters_.splice(0).forEach(waiter => JournalTry(waiter));
            Object.keys(this.eventHandlers_).forEach(event => this.BindEvent_(event));

            const evaluate = (expression: string, contexts?: Record<string, any>) => {
                expression && EvaluateLater({
                    componentId: this.componentId_,
                    contextElement: this,
                    expression,
                    disableFunctionCall: false,
                })(undefined, [], contexts);
            };

            const events = {
                oneditorchange: 'editor-change',
                ontextchange: 'text-change',
                onselectionchanges: 'selection-change',
            };

            Object.entries(events).forEach(([key, event]) => {
                if (!this[key] && !this.onchanges){
                    return;
                }

                this.AddEventHandler(event, ({ event, eventArgs }) => {
                    evaluate(this[key], {
                        event: {
                            name: event,
                            args: eventArgs,
                        },
                    });

                    evaluate(this.onchanges, {
                        event: {
                            name: event,
                            args: eventArgs,
                        },
                    });
                });
            });

            evaluate(this.onready);
        });
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_({ scope, ...rest }, postAttributesCallback);
        scope.AddPostProcessCallback(() => (!this.defer && this.Mount()));
        scope.AddUninitCallback(() => {
            this.quill_ && Object.keys(this.boundEvents_).forEach(event => this.quill_!.off(<any>event, this.boundEvents_[event]));
            this.quill_ = null;
            this.container = null;
        });
    }
    
    protected SetPrompt_(name: string){
        if (!this.prompts_ || name === this.activePrompt_){
            return;
        }

        this.activePrompt_ = name;

        this.activePrompts_ && this.activePrompts_.forEach(prompt => prompt.Toggle(false));
        this.activePrompts_ = this.prompts_.filter(prompt => (prompt.name === name));

        this.activePrompts_.forEach(prompt => prompt.Toggle(true));
    }
    
    protected BindEvent_(event: string){
        if (!this.quill_ || (event in this.boundEvents_)){
            return;
        }
        
        this.boundEvents_[event] = (...args: any[]) => {
            const instance = this.quill_;
            if (!instance){
                return;
            }
            
            const hasFocus = instance.hasFocus(), format = { value: <StringMap | null>null }, getFormat = () => {
                format.value = (format.value || instance.getFormat());
                return format.value;
            };

            this.eventHandlers_[event].forEach(handler => handler({
                instance,
                focused: !!hasFocus,
                event,
                eventArgs: args,
                getFormat,
            }));
        };

        this.quill_?.on(<any>event, this.boundEvents_[event]);
    }
}

export function QuillElementCompact(){
    RegisterCustomElement(QuillElement, 'quill');
}
