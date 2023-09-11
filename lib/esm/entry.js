import { WaitForGlobal } from '@benbraide/inlinejs';
import { QuillElementCompact } from './components/quill';
import { QuillContainerElementCompact } from './components/container';
import { QuillModuleElementCompact } from './components/module';
import { QuillFormatElementCompact } from './components/format';
import { QuillToolbarElementCompact } from './components/toolbar';
import { QuillSizeElementCompact } from './components/size';
import { QuillCommandElementCompact } from './components/command';
import { QuillContentElementCompact } from './components/content';
import { QuillHtmlElementCompact } from './components/html';
import { QuillInputElementCompact } from './components/input';
import { QuillPromptElementCompact } from './components/prompt';
export function InlineJSQuill() {
    WaitForGlobal().then(() => {
        QuillElementCompact();
        QuillContainerElementCompact();
        QuillModuleElementCompact();
        QuillFormatElementCompact();
        QuillToolbarElementCompact();
        QuillSizeElementCompact();
        QuillCommandElementCompact();
        QuillContentElementCompact();
        QuillHtmlElementCompact();
        QuillInputElementCompact();
        QuillPromptElementCompact();
    });
}
