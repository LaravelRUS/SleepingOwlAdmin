@include(AdminTemplate::getViewPath('column.editable.partials.editor'), [
    'editorDisplayHtml' => true,
    'editorEmptyText' => $uncheckedLabel,
    'editorOptions' => [['value' => 1, 'text' => $checkedLabel]],
    'editorTextHtml' => true,
    'editorType' => 'boolean',
])

