import Quill from "quill";
export declare type QuillEventType = 'text-change' | 'selection-change' | 'editor-change';
export interface IQuillEventHandlerParams {
    instance: Quill;
    focused: boolean;
    event: string;
    eventArgs: any[];
    getFormat: () => Record<string, any>;
}
export declare type QuillEventHandlerType = (params: IQuillEventHandlerParams) => void;
export interface IQuillPrompt {
    name: string;
    Toggle(show: boolean): void;
}
export interface IQuillElement {
    container: HTMLElement | null;
    theme: string;
    defer: boolean;
    readonly: boolean;
    AddModule(key: string, value: any): void;
    RemoveModule(key: string): void;
    GetDefaultModules(): Record<string, any>;
    AddToolbarItem(key: string, value: any): void;
    RemoveToolbarItem(key: string): void;
    AddFormat(key: string, value: any): void;
    RemoveFormat(key: string): void;
    AddSize(value: string | Array<string>): void;
    AddPrompt(prompt: IQuillPrompt): void;
    RemovePrompt(prompt: IQuillPrompt): void;
    SetActivePrompt(prompt: string): void;
    ToggleActivePrompt(prompt: string): void;
    GetActivePrompt(): string;
    AddEventHandler(event: QuillEventType, handler: QuillEventHandlerType): void;
    RemoveEventHandler(event: QuillEventType, handler: QuillEventHandlerType): void;
    GetInstance(): Quill | null;
    WaitInstance(): Promise<Quill | null>;
    Mount(): void;
}
export interface IQuillInputTheme {
    width?: string;
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    textColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    borderColor?: string;
    borderWidth?: string;
    borderStyle?: string;
    borderRadius?: string;
    focusBorderColor?: string;
    placeholderColor?: string;
}
export interface IQuillInputItem {
    type: string;
    placeholder?: string;
    value?: string;
    attributes?: Record<string, string | true>;
}
export interface IQuillInput {
    GetItems(): Array<HTMLInputElement>;
    Reset(): void;
}
export interface IQuillInputTarget {
    AddQuillInput(input: IQuillInput): void;
    RemoveQuillInput(input: IQuillInput): void;
}
