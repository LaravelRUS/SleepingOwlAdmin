const {
    createCkeditor4Adapter,
} = require('../../features/forms/wysiwyg/adapters/ckeditor4')

let adapter
const current = () => (adapter ??= createCkeditor4Adapter(globalThis.CKEDITOR))

Admin.WYSIWYG.register(
    'ckeditor',
    (...args) => current().switchOn(...args),
    (...args) => current().switchOff(...args),
    (...args) => current().exec(...args),
)
