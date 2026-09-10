<div class="soa-inline-editor-select"
     data-inline-editor-control
     data-inline-editor-select
     tabindex="-1">
    <select class="soa-inline-editor-control soa-select"
            data-inline-editor-select-native
            id="{{ $editorControlId }}"
            name="{{ $name }}"
            aria-label="{{ strip_tags($editorTitle ?? $name) }}"
            @if($required ?? false) required @endif>
        @foreach($editorOptions as $option)
            <option value="{{ $option['value'] }}" @selected((string) $option['value'] === (string) $value)>{{ $option['text'] }}</option>
        @endforeach
    </select>
    @if($editorCanClear)
        <button class="soa-inline-editor-clear soa-icon-button"
                data-inline-editor-clear
                type="button"
                aria-label="@lang('sleeping_owl::lang.button.clear')"
                title="@lang('sleeping_owl::lang.button.clear')">
            <i class="fas fa-times" aria-hidden="true"></i>
        </button>
    @endif
</div>
