const {
    createSimpleMdeAdapter,
} = require('../../features/forms/wysiwyg/adapters/simplemde')

let adapter
const current = () =>
    (adapter ??= createSimpleMdeAdapter(globalThis.SimpleMDE, globalThis.document))

Admin.WYSIWYG.register(
    'simplemde',
    (...args) => current().switchOn(...args),
    (...args) => current().switchOff(...args),
    (...args) => current().exec(...args),
)
