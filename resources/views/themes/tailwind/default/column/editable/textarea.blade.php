@include(AdminTemplate::getViewPath('column.editable.partials.editor'), [
    'editorType' => 'textarea',
    'editorTextHtml' => ! ($isolated ?? true),
    'editorDisplayHtml' => ! ($isolated ?? true),
])

