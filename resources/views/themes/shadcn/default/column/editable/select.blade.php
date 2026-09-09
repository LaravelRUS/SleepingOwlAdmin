@include(AdminTemplate::getViewPath('column.editable.partials.editor'), [
    'editorEmptyText' => trans('sleeping_owl::lang.select.no_items'),
    'editorOptions' => $options,
    'editorTextHtml' => true,
    'editorTitle' => $title,
    'editorType' => 'select',
])

