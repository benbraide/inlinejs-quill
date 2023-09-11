import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
import { IQuillElement } from "../types";
export declare class QuillContentElement extends CustomElement {
    protected hiddenInput_: HTMLInputElement | null;
    quill: IQuillElement | null;
    constructor();
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
}
export declare function QuillContentElementCompact(): void;
