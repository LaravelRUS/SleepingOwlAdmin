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
