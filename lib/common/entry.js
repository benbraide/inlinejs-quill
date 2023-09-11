"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineJSQuill = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const quill_1 = require("./components/quill");
const container_1 = require("./components/container");
const module_1 = require("./components/module");
const format_1 = require("./components/format");
const toolbar_1 = require("./components/toolbar");
const size_1 = require("./components/size");
const command_1 = require("./components/command");
const content_1 = require("./components/content");
const html_1 = require("./components/html");
const input_1 = require("./components/input");
const prompt_1 = require("./components/prompt");
function InlineJSQuill() {
    (0, inlinejs_1.WaitForGlobal)().then(() => {
        (0, quill_1.QuillElementCompact)();
        (0, container_1.QuillContainerElementCompact)();
        (0, module_1.QuillModuleElementCompact)();
        (0, format_1.QuillFormatElementCompact)();
        (0, toolbar_1.QuillToolbarElementCompact)();
        (0, size_1.QuillSizeElementCompact)();
        (0, command_1.QuillCommandElementCompact)();
        (0, content_1.QuillContentElementCompact)();
        (0, html_1.QuillHtmlElementCompact)();
        (0, input_1.QuillInputElementCompact)();
        (0, prompt_1.QuillPromptElementCompact)();
    });
}
exports.InlineJSQuill = InlineJSQuill;
