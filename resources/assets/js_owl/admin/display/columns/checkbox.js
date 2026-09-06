const {
    bindTableCheckboxes,
} = require('../../../../../frontend/features/table/selection/checkbox-controls')

Admin.Modules.register('display.columns.checkbox', () =>
    bindTableCheckboxes({ root: document, selectedRowClass: 'info' }),
)
