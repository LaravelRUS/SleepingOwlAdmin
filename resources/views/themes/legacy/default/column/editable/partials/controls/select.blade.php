<select class="soa-inline-editor-control" data-inline-editor-control>
    @foreach($editorOptions as $option)
        <option value="{{ $option['value'] }}"
                @if((string) $option['value'] === (string) $value) selected @endif>{{ $option['text'] }}</option>
    @endforeach
</select>
