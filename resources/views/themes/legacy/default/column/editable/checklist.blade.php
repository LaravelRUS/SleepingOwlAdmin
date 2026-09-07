@php
    $editorDisplay = $text;
    if (is_null($editorDisplay) && !empty($values)) {
        $editorDisplay = view(
            AdminTemplate::getViewPath('column.editable.partials.list_values'),
            compact('values', 'maxLists')
        )->render();
    }
@endphp
@include(AdminTemplate::getViewPath('column.editable.partials.editor'), [
    'editorDisplay' => $editorDisplay,
    'editorOptions' => $options,
    'editorTextHtml' => true,
    'editorTitle' => $title,
    'editorType' => 'checklist',
])
