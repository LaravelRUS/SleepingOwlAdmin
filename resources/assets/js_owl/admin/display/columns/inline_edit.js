Admin.Modules.register('display.columns.inline-edit', () => {
    $('.inline-editable').editable();
}, 0, ['datatables::draw', 'bootstrap::tab::shown'])