import { Quill } from "quill";
import { CustomElement } from "@benbraide/inlinejs-element";
import { IQuillElement } from "../types";
import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
export declare class QuillToolbarElement extends CustomElement {
    protected quillInstance_: Quill | null;
    protected button_: HTMLButtonElement | null;
    protected value_: string | Array<string | number | boolean>;
    protected previousValue_: string | number | boolean | null;
    protected isActive_: boolean;
    quill: IQuillElement | null;
    name: string;
    UpdateValueProperty(value: string | Array<string | number | boolean>): void;
    toggle: boolean;
    onactive: string;
    constructor();
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected HandleClick_(): void;
    protected UpdateActive_(focused?: boolean, getFormat?: () => Record<string, any>): void;
    protected ToggleActive_(active: boolean, value?: any): void;
    protected EvaluateOnActive_(value?: any): void;
}
export declare function QuillToolbarElementCompact(): void;
