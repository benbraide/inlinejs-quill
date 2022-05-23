import { WaitForGlobal } from '@benbraide/inlinejs';

import { QuillDirectiveHandlerCompact } from './directive/quill';

WaitForGlobal().then(() => QuillDirectiveHandlerCompact());
