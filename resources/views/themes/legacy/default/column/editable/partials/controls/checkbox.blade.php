@php
    $editorSelectedValues = array_filter(array_map('trim', explode(',', (string) $value)), 'strlen');
    $editorOption = $editorOptions[0];
@endphp

<div class="custom-control custom-checkbox" data-inline-editor-control>
    <input class="custom-control-input soa-inline-editor-check-input"
           data-inline-editor-check-input
           id="{{ $editorControlId }}"
           name="{{ $name }}[]"
           @if($required ?? false) required @endif
           type="checkbox"
           value="{{ $editorOption['value'] }}"
           @if(in_array((string) $editorOption['value'], $editorSelectedValues, true)) checked @endif>
    <label class="custom-control-label" for="{{ $editorControlId }}">
        {!! $editorOption['text'] !!}
    </label>
</div>
