<select class="soa-inline-editor-control"
        data-inline-editor-control
        id="{{ $editorControlId }}"
        name="{{ $name }}"
        @if($required ?? false) required @endif>
    @foreach($editorOptions as $option)
        <option value="{{ $option['value'] }}"
                @if((string) $option['value'] === (string) $value) selected @endif>{{ $option['text'] }}</option>
    @endforeach
</select>
