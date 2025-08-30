import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
import { IQuillElement } from "../types";
export declare class QuillCommandElement extends CustomElement {
    protected value_: any;
    quill: IQuillElement | null;
    name: string;
    UpdateValueProperty(value: any): void;
    constructor();
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
}
export declare function QuillCommandElementCompact(): void;
