import { WaitForGlobal } from '@benbraide/inlinejs';

import { QuillDirectiveHandlerCompact } from './directive/quill';

export function InlineJSQuill(){
    WaitForGlobal().then(() => QuillDirectiveHandlerCompact());
}
