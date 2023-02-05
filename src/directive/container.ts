import {
    FindComponentById,
    AddDirectiveHandler,
    CreateDirectiveHandlerCallback,
    JournalError,
} from "@benbraide/inlinejs";

export const QuillContainerDirectiveHandler = CreateDirectiveHandlerCallback('container', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    let resolvedComponent = (component || FindComponentById(componentId));
    if (!resolvedComponent){
        return;
    }

    const quillKey = '$quill';
    
    let quill = resolvedComponent.FindElementLocalValue(contextElement, quillKey, true)?.root;
    if (quill){
        quill.container = contextElement;
    }
    else{
        JournalError('Quill not initialized!', `x-quill:container`, contextElement);
    }
});

export function QuillContainerDirectiveHandlerCompact(){
    AddDirectiveHandler(QuillContainerDirectiveHandler, 'quill');
}
