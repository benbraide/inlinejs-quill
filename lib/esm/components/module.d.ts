import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
import { IQuillElement } from "../types";
export declare class QuillModuleElement extends CustomElement {
    quill: IQuillElement | null;
    name: string;
    value: any;
    constructor();
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
}
export declare function QuillModuleElementCompact(): void;
