const {
    createTinyMceAdapter,
} = require('../../../frontend/features/forms/wysiwyg/adapters/tinymce')

let adapter
const current = () => (adapter ??= createTinyMceAdapter(globalThis.tinymce))

Admin.WYSIWYG.register(
    'tinymce',
    (...args) => current().switchOn(...args),
    (...args) => current().switchOff(...args),
    (...args) => current().exec(...args),
)
