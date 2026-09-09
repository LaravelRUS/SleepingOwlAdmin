@php
    $editorSelectedValues = array_filter(array_map('trim', explode(',', (string) $value)), 'strlen');
@endphp

<fieldset class="soa-inline-editor-checklist"
          data-inline-editor-control
          @if($required ?? false) aria-required="true" @endif>
    @foreach($editorOptions as $option)
        @php($editorOptionId = $editorControlId.'-'.$loop->index)
        <label class="soa-inline-editor-check-option" for="{{ $editorOptionId }}">
            <input class="soa-inline-editor-check-input soa-checkbox"
                   data-inline-editor-check-input
                   id="{{ $editorOptionId }}"
                   name="{{ $name }}[]"
                   type="checkbox"
                   value="{{ $option['value'] }}"
                   @if(in_array((string) $option['value'], $editorSelectedValues, true)) checked @endif>
            <span class="soa-inline-editor-check-label">{!! $option['text'] !!}</span>
        </label>
    @endforeach
</fieldset>
