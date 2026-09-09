const {
    createWysiwygRegistry,
} = require('../../../frontend/features/forms/wysiwyg/wysiwyg-registry')

module.exports = createWysiwygRegistry({
    events: Admin.Events,
    log: (message, scope) => Admin.log(message, scope),
})
