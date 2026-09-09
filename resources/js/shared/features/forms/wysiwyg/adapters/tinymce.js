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
