const {
    createCkeditor5Adapter,
} = require('../../features/forms/wysiwyg/adapters')

let adapter
const current = () =>
    (adapter ??= createCkeditor5Adapter(globalThis.ClassicEditor, globalThis.document))

Admin.WYSIWYG.register(
    'ckeditor5',
    (...args) => current().switchOn(...args),
    (...args) => current().switchOff(...args),
    (...args) => current().exec(...args),
)
