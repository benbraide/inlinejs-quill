"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuillContainerDirectiveHandlerCompact = exports.QuillContainerDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.QuillContainerDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('container', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    var _a;
    let resolvedComponent = (component || (0, inlinejs_1.FindComponentById)(componentId));
    if (!resolvedComponent) {
        return;
    }
    const quillKey = '$quill';
    let quill = (_a = resolvedComponent.FindElementLocalValue(contextElement, quillKey, true)) === null || _a === void 0 ? void 0 : _a.root;
    if (quill) {
        quill.container = contextElement;
    }
    else {
        (0, inlinejs_1.JournalError)('Quill not initialized!', `x-quill:container`, contextElement);
    }
});
function QuillContainerDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.QuillContainerDirectiveHandler, 'quill');
}
exports.QuillContainerDirectiveHandlerCompact = QuillContainerDirectiveHandlerCompact;
