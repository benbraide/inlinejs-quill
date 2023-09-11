import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
import { IQuillElement } from "../types";
export declare class QuillCommandElement extends CustomElement {
    protected quill_: IQuillElement | null;
    protected value_: any;
    UpdateQuillProperty(value: IQuillElement | null): void;
    name: string;
    UpdateValueProperty(value: any): void;
    constructor();
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
}
export declare function QuillCommandElementCompact(): void;
