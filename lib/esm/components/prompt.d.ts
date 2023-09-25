import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
import { IQuillElement, IQuillInput, IQuillInputTarget, IQuillPrompt } from "../types";
export declare class QuillPromptElement extends CustomElement implements IQuillPrompt, IQuillInputTarget {
    protected inputs_: IQuillInput[];
    protected display_: string;
    protected shown_: boolean;
    quill: IQuillElement | null;
    name: string;
    onsave: string;
    ondismiss: string;
    persist: boolean;
    toggle: boolean;
    highlight: boolean;
    button: boolean;
    constructor();
    Toggle(show: boolean): void;
    AddQuillInput(input: IQuillInput): void;
    RemoveQuillInput(input: IQuillInput): void;
    Reset(): void;
    Confirm(): void;
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
}
export declare function QuillPromptElementCompact(): void;
