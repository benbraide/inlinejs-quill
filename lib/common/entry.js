"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineJSQuill = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const quill_1 = require("./directive/quill");
function InlineJSQuill() {
    (0, inlinejs_1.WaitForGlobal)().then(() => (0, quill_1.QuillDirectiveHandlerCompact)());
}
exports.InlineJSQuill = InlineJSQuill;
