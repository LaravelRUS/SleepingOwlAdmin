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
    if (command === 'insert') insertText(editor, data)
    if (command === 'changeHeight') editor.resize?.('100%', data)
}

function insertText(editor, data) {
    editor.model.change((writer) => {
        editor.model.insertContent(writer.createText(String(data)))
    })
}
