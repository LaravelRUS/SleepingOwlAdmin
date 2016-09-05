Admin.Modules.add('display.columns.inline-edit', () => {
    $('.inline-editable').editable();
}, 0, ['datatables::draw', 'bootstrap::tab::shown'])