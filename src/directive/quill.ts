import Quill from "quill";

import {
    FindComponentById,
    AddDirectiveHandler,
    CreateDirectiveHandlerCallback,
    GetGlobal,
    JournalError,
    IResourceConcept,
    BindEvent,
    ResolveOptions,
    IsObject,
    EvaluateLater
} from "@benbraide/inlinejs";

export const QuillDirectiveHandler = CreateDirectiveHandlerCallback('quill', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if (BindEvent({ contextElement, expression,
        component: (component || componentId),
        key: 'quill',
        event: argKey,
        defaultEvent: 'ready',
        eventWhitelist: ['done'],
        options: argOptions,
        optionBlacklist: ['window', 'document', 'outside'],
    })){
        return;
    }

    let resolvedComponent = (component || FindComponentById(componentId));
    if (!resolvedComponent){
        return JournalError('Failed to retrieve element scope.', 'x-quill', contextElement);
    }

    // let bindPrompt = (action: string, defaultValue = '') => {
    //     let input = contextElement.querySelector('input'), onEvent = (e: Event) => {
    //         e.preventDefault();
    //         e.stopPropagation();

    //         try{
    //             details.quillInstance?.format(action, input!.value);
    //         }
    //         catch{}
            
    //         input!.value = defaultValue;
    //         contextElement.dispatchEvent(new CustomEvent(`${QuillDirectiveName}.done`));
    //     };

    //     if (input){
    //         input.value = defaultValue;
    //         input.addEventListener('keydown', (e) => {
    //             if (e.key === 'Enter'){
    //                 onEvent(e);
    //             }
    //         });
    //         contextElement.querySelector('button')?.addEventListener('click', onEvent);
    //     }
    // };

    const quillKey = '$quill';

    let options = ResolveOptions({
        options: {
            manual: false,
            readonly: false,
            snow: false,
            bubble: false,
        },
        list: argOptions,
    });

    const getEventHandlers = (event: string) => (state.eventHandlers[event] = (state.eventHandlers[event] || []));

    const bindEvent = (event: 'text-change' | 'selection-change' | 'editor-change') => {
        state.boundEvents[event] = () => {
            let hasFocus = state.instance?.hasFocus();
            state.instance && getEventHandlers(event).forEach(handler => handler(state.instance!, !!hasFocus));
        };
        state.instance?.on(<any>event, state.boundEvents[event]);
    };

    let state = {
        theme: (options.snow ? 'snow' : (options.bubble ? 'bubble' : 'default')),
        modules: {
            toolbar: <Record<string, any> | boolean>false,
        },
        instance: <Quill | null>null,
        container: <HTMLElement | null>null,
        eventHandlers: <{ [key: string]: Array<(instance: Quill, focused: boolean) => void> }>{},
        boundEvents: <{ [key: string]: () => void }>{},
        dev: {
            setTheme(value: string){
                state.theme = value;
            },
            addModule(key: string, value: any){
                state.modules[key] = value;
            },
            removeModule(key: string){
                delete state.modules[key];
            },
            addToolbarItem(key: string, value: any){
                state.modules.toolbar = (IsObject(state.modules.toolbar) ? state.modules.toolbar : {});
                state.modules.toolbar[key] = value;
            },
            removeToolbarItem(key: string){
                IsObject(state.modules.toolbar) && delete state.modules.toolbar[key];
            },
            replaceToolbarItem(value: any){
                state.modules.toolbar = value;
            },
            addEventListener(event: 'text-change' | 'selection-change' | 'editor-change', handler: (instance: Quill) => void){
                getEventHandlers(event).push(handler);
                (state.instance && !state.boundEvents.hasOwnProperty(event)) && bindEvent(event);
            },
            removeEventListener(event: 'text-change' | 'selection-change' | 'editor-change', handler: (instance: Quill) => void){
                let handlers = getEventHandlers(event);
                handlers.splice(handlers.indexOf(handler), 1);

                if (state.boundEvents.hasOwnProperty(event) && handlers.length === 0){
                    state.instance?.off(<any>event, state.boundEvents[event]);
                    delete state.boundEvents[event];
                }
            },
            setContainer(el: HTMLElement | null){
                state.container = el;
            },
            addUrl(url: string | Array<string>){
                state.urls = (state.urls || []);
                state.urls.push(...(Array.isArray(url) ? url : [url]));
            },
            bind(){
                let resourceConcept = GetGlobal().GetConcept<IResourceConcept>('resource');
                if (resourceConcept && state.urls){
                    resourceConcept.Get({
                        items: state.urls,
                        concurrent: true,
                    }).then(init);
                }
                else{
                    init();
                }
            },
        },
        urls: <Array<string> | null>null,
        ready: false,
    };

    let elementScope = resolvedComponent.CreateElementScope(contextElement), init = () => {
        if (state.ready || !state.container || typeof window['Quill'] !== 'function'){
            return;
        }

        state.instance = new (window['Quill'])(state.container, {
            modules: state.modules,
            theme: state.theme,
            readOnly: options.readonly,
        });

        state.ready = true;
        Object.keys(state.eventHandlers).forEach(event => bindEvent(<any>event));//Bind all events.
        contextElement.dispatchEvent(new CustomEvent('quill.ready'));
    };

    elementScope?.SetLocal(quillKey, {
        get root(){
            return this;
        },
        get parent(){
            return null;
        },
        get instance(){
            return state.instance;
        },
        get element(){
            return contextElement;
        },
        get container(){
            return state.container;
        },
        get theme(){
            return state.theme;
        },
        get dev(){
            return state.dev;
        },
        get isReady(){
            return state.ready;
        },
        set container(value){
            state.dev.setContainer(value);
        },
        set theme(value){
            state.dev.setTheme(value);
        },
        addUrl(url: string | Array<string>){
            state.dev.addUrl(url);
        },
        bind(){
            state.dev.bind();
        },
    });

    elementScope?.AddUninitCallback(() => {
        if (state.instance){
            Object.keys(state.boundEvents).forEach(event => state.instance!.off(<any>event, state.boundEvents[event]));
            state.instance = null;
        }
        
        state.modules.toolbar = <any>null;
        state.modules = <any>null;
        
        state.container = null;
        state.dev = <any>null;

        state.eventHandlers = <any>null;
        state.boundEvents = <any>null;

        state.ready = false;
        state = <any>null;
    });

    EvaluateLater({ componentId, contextElement, expression })((value) => {
        if (IsObject(value)){
            state.theme = (value.theme || state.theme);
            IsObject(value.modules) && (state.modules = { ...state.modules, ...value.modules });

            state.modules.toolbar = (value.toolbar || state.modules.toolbar);
            state.dev.addUrl(Array.isArray(value.urls) ? value.urls : (value.urls ? [value.urls] : []));

            !options.manual && FindComponentById(componentId)?.FindElementScope(contextElement)?.AddPostProcessCallback(() => state.dev.bind());
        }
    });
});

export function QuillDirectiveHandlerCompact(){
    AddDirectiveHandler(QuillDirectiveHandler);
}
