const {
    createTinyMceAdapter,
} = require('../../features/forms/wysiwyg/adapters')

let adapter
const current = () => (adapter ??= createTinyMceAdapter(globalThis.tinymce))

Admin.WYSIWYG.register(
    'tinymce',
    (...args) => current().switchOn(...args),
    (...args) => current().switchOff(...args),
    (...args) => current().exec(...args),
)
