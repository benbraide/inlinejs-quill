import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
import { IQuillElement } from "../types";
export declare class QuillContentElement extends CustomElement {
    protected hiddenInput_: HTMLInputElement | null;
    protected name_: string;
    quill: IQuillElement | null;
    UpdateNameProperty(value: string): void;
    constructor();
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
}
export declare function QuillContentElementCompact(): void;
