export function createCkeditor4Adapter(CKEDITOR) {
    if (typeof CKEDITOR?.replace !== 'function') {
        throw new TypeError('CKEditor 4 API is required.')
    }

    return {
        exec: executeCkeditor4,
        switchOff: (editor) => editor.destroy(),
        switchOn: (id, parameters = {}) => {
            CKEDITOR.disableAutoInline = true
            return CKEDITOR.replace(id, { ...parameters })
        },
    }
}

function executeCkeditor4(editor, command, _id, data) {
    if (command === 'insert') editor.insertText(data)
    if (command === 'changeHeight') editor.resize('100%', data)
}

export function createCkeditor5Adapter(ClassicEditor, document = globalThis.document) {
    if (typeof ClassicEditor?.create !== 'function') {
        throw new TypeError('CKEditor 5 API is required.')
    }

    return {
        exec: executeCkeditor5,
        switchOff: (editor) => editor.destroy(),
        switchOn: (id, parameters = {}) => {
            return ClassicEditor.create(document.getElementById(id), parameters)
        },
    }
}

function executeCkeditor5(editor, command, _id, data) {
    if (command === 'insert') insertCkeditor5Text(editor, data)
    if (command === 'changeHeight') editor.resize?.('100%', data)
}

function insertCkeditor5Text(editor, data) {
    editor.model.change((writer) => {
        editor.model.insertContent(writer.createText(String(data)))
    })
}

export function createSimpleMdeAdapter(SimpleMDE, document = globalThis.document) {
    assertConstructor(SimpleMDE, 'SimpleMDE')

    return {
        exec: (editor, command, _id, data) => executeSimpleMde(editor, command, data),
        switchOff: (editor) => editor.destroy(),
        switchOn: (id, parameters = {}) => {
            return new SimpleMDE({ element: document.getElementById(id), ...parameters })
        },
    }
}

function executeSimpleMde(editor, command, data) {
    if (command === 'insert') editor.codemirror.replaceSelection(data)
}

function assertConstructor(value, name) {
    if (typeof value !== 'function') throw new TypeError(`${name} constructor is required.`)
}

export function createTinyMceAdapter(tinymce) {
    if (typeof tinymce?.init !== 'function') throw new TypeError('TinyMCE API is required.')

    return {
        exec: (editor, command, _id, data) => executeTinyMce(editor, command, data),
        switchOff: removeTinyMce,
        switchOn: (id, parameters = {}) => {
            return tinymce.init({ selector: `#${cssEscape(id)}`, ...parameters })
        },
    }
}

function executeTinyMce(editor, command, data) {
    if (command === 'insert') editor.insertContent(data)
}

function removeTinyMce(editor) {
    if (typeof editor.remove === 'function') return editor.remove()
    return editor.destroy?.()
}

function cssEscape(value) {
    if (typeof globalThis.CSS?.escape === 'function') return globalThis.CSS.escape(value)

    return String(value).replace(/[^a-zA-Z0-9_-]/g, (character) => `\\${character}`)
}
