<div class="soa-inline-editor-range" data-inline-editor-control>
    <input {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag([
        'class' => 'form-range soa-inline-editor-control soa-range',
        'data-inline-editor-range-input' => true,
        'id' => $editorControlId,
        'max' => $max ?? null,
        'min' => $min ?? null,
        'name' => $name,
        'required' => ($required ?? false) ? true : null,
        'step' => $step ?? null,
        'type' => 'range',
        'value' => $value,
    ]) !!}>
    <output class="soa-inline-editor-range-value"
            data-inline-editor-range-output
            hidden>{{ $value }}</output>
    <div class="soa-inline-editor-range-number-wrap">
        <input {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag([
            'aria-label' => strip_tags($title ?? $name),
            'class' => 'soa-inline-editor-control soa-inline-editor-range-number soa-input',
            'data-inline-editor-range-number' => true,
            'id' => $editorControlId.'-number',
            'max' => $max ?? null,
            'min' => $min ?? null,
            'required' => ($required ?? false) ? true : null,
            'step' => $step ?? null,
            'type' => 'number',
            'value' => $value,
        ]) !!}>
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
</div>
