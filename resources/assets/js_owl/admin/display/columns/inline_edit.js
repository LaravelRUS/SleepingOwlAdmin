const {
    createLegacyInlineEditor,
} = require('../../../../../frontend/features/table/themes/legacy-adminlte/inline-editor')

const inlineEditor = createLegacyInlineEditor()

Admin.Modules.register(
    'display.columns.inline-edit',
    () => inlineEditor.scan(document),
    0,
    ['bootstrap::tab::shown'],
)

module.exports = inlineEditor
