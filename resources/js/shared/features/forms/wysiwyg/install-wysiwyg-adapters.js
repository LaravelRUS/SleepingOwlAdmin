import {
    createCkeditor4Adapter,
    createCkeditor5Adapter,
    createSimpleMdeAdapter,
    createTinyMceAdapter,
} from './adapters.js'

export function installWysiwygAdapters(registry, target = globalThis) {
    registerLazy(registry, 'ckeditor', () => createCkeditor4Adapter(target.CKEDITOR))
    registerLazy(registry, 'ckeditor5', () =>
        createCkeditor5Adapter(target.ClassicEditor, target.document),
    )
    registerLazy(registry, 'simplemde', () =>
        createSimpleMdeAdapter(target.SimpleMDE, target.document),
    )
    registerLazy(registry, 'tinymce', () => createTinyMceAdapter(target.tinymce))
}

function registerLazy(registry, name, createAdapter) {
    let adapter
    const current = () => (adapter ??= createAdapter())

    registry.register(
        name,
        (...arguments_) => current().switchOn(...arguments_),
        (...arguments_) => current().switchOff(...arguments_),
        (...arguments_) => current().exec(...arguments_),
    )
}
