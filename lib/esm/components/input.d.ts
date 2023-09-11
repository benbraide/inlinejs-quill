import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement, INativeElement } from "@benbraide/inlinejs-element";
import { IQuillInput, IQuillInputItem, IQuillInputTheme } from "../types";
export declare class QuillInputElement extends CustomElement implements IQuillInput {
    protected quillNativeElements_: Record<string, Array<INativeElement & HTMLElement>>;
    protected items_: HTMLInputElement[];
    protected expandedItems_: Array<IQuillInputItem | string> | null;
    protected value_: string;
    protected file_: File | null;
    theme: IQuillInputTheme | string | null;
    items: Array<IQuillInputItem | string> | null;
    placeholder: string;
    onvaluechange: string;
    constructor();
    AddNativeElement(element: INativeElement & HTMLElement): void;
    RemoveNativeElement(element: INativeElement): void;
    GetItems(): HTMLInputElement[];
    Reset(): void;
    GetDefaultTheme(): IQuillInputTheme;
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected CreateStyleElement_(): void;
    protected CreateInputElements_(): void;
    protected ExpandItems_(): void;
    static className: string;
}
export declare function QuillInputElementCompact(): void;
