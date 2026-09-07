@php
    $editorSelectedValues = array_filter(array_map('trim', explode(',', (string) $value)), 'strlen');
@endphp

<fieldset class="soa-inline-editor-checklist" data-soa-inline-editor-control>
    @foreach($editorOptions as $option)
        <label class="soa-inline-editor-check-option">
            <input class="soa-inline-editor-check-input"
                   data-soa-inline-editor-check-input
                   type="checkbox"
                   value="{{ $option['value'] }}"
                   @if(in_array((string) $option['value'], $editorSelectedValues, true)) checked @endif>
            <span class="soa-inline-editor-check-label">{{ $option['text'] }}</span>
        </label>
    @endforeach
</fieldset>
