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
