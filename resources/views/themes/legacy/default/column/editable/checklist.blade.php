@include(AdminTemplate::getViewPath('column.editable.partials.editor'), [
    'editorOptions' => $options,
    'editorTextHtml' => true,
    'editorTitle' => $title,
    'editorType' => 'checklist',
])
