const {
    installInlineEditors,
} = require('../../../../../frontend/features/table/editing/install-inline-editors')

const inlineEditor = installInlineEditors(Admin, {
    labels: {
        cancel: trans('lang.button.cancel'),
        error: trans('lang.table.error'),
        save: trans('lang.button.save'),
    },
})

module.exports = inlineEditor
