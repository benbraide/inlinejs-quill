import { FindComponentById, AddDirectiveHandler, CreateDirectiveHandlerCallback, JournalError, } from "@benbraide/inlinejs";
export const QuillContainerDirectiveHandler = CreateDirectiveHandlerCallback('container', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    var _a;
    let resolvedComponent = (component || FindComponentById(componentId));
    if (!resolvedComponent) {
        return;
    }
    const quillKey = '$quill';
    let quill = (_a = resolvedComponent.FindElementLocalValue(contextElement, quillKey, true)) === null || _a === void 0 ? void 0 : _a.root;
    if (quill) {
        quill.container = contextElement;
    }
    else {
        JournalError('Quill not initialized!', `x-quill:container`, contextElement);
    }
});
export function QuillContainerDirectiveHandlerCompact() {
    AddDirectiveHandler(QuillContainerDirectiveHandler, 'quill');
}
