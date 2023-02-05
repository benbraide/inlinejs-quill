import { WaitForGlobal } from '@benbraide/inlinejs';

import { QuillDirectiveHandlerCompact } from './directive/quill';
import { QuillContainerDirectiveHandlerCompact } from './directive/container';

export function InlineJSQuill(){
    WaitForGlobal().then(() => {
        QuillDirectiveHandlerCompact();
        QuillContainerDirectiveHandlerCompact();
    });
}
