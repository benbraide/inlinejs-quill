import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
import { IQuillElement } from "../types";
export declare class QuillHtmlElement extends CustomElement {
    protected codeBlock_: HTMLElement | null;
    quill: IQuillElement | null;
    constructor();
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected OutputHtml_(element: Element, pad?: number, refresh?: boolean): void;
    protected AddHtmlLine_(pad: number, value: string): void;
}
export declare function QuillHtmlElementCompact(): void;
