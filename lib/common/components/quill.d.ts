import { Quill } from "quill";
import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
import { IQuillElement, IQuillPrompt, QuillEventHandlerType } from "../types";
export declare class QuillElement extends CustomElement implements IQuillElement {
    protected quill_: Quill | null;
    protected mounting_: boolean;
    protected modules_: Record<string, any> | null;
    protected formats_: Record<string, any> | null;
    protected sizes_: Array<string> | null;
    protected prompts_: Array<IQuillPrompt> | null;
    protected activePrompts_: Array<IQuillPrompt> | null;
    protected activePrompt_: string;
    protected eventHandlers_: Record<string, Array<QuillEventHandlerType>>;
    protected boundEvents_: Record<string, (...args: any[]) => void>;
    protected instanceWaiters_: (() => void)[];
    container: HTMLElement | null;
    theme: string;
    placeholder: string;
    defer: boolean;
    readonly: boolean;
    debug: boolean;
    onready: string;
    oneditorchange: string;
    ontextchange: string;
    onselectionchanges: string;
    onchanges: string;
    UpdateModulesProperty(value: Record<string, any>): void;
    UpdatePromptProperty(value: string): void;
    UpdateResourcesProperty(value: Array<any>): void;
    constructor();
    AddModule(key: string, value: any): void;
    RemoveModule(key: string): void;
    GetDefaultModules(): {
        toolbar: boolean | Record<string, any>;
    };
    AddToolbarItem(key: string, value: any): void;
    RemoveToolbarItem(key: string): void;
    AddFormat(key: string, value: any): void;
    RemoveFormat(key: string): void;
    AddSize(value: string | Array<string>): void;
    AddPrompt(prompt: IQuillPrompt): void;
    RemovePrompt(prompt: IQuillPrompt): void;
    SetActivePrompt(prompt: string): void;
    ToggleActivePrompt(prompt: string): void;
    GetActivePrompt(): string;
    AddEventHandler(event: string, handler: QuillEventHandlerType): void;
    RemoveEventHandler(event: string, handler: QuillEventHandlerType): void;
    GetInstance(): Quill | null;
    WaitInstance(): Promise<Quill | null>;
    Mount(): void;
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected SetPrompt_(name: string): void;
    protected BindEvent_(event: string): void;
}
export declare function QuillElementCompact(): void;
