import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
export declare class QuillContainerElement extends CustomElement {
    constructor();
    protected HandleElementScopeCreated_(params: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
}
export declare function QuillContainerElementCompact(): void;
