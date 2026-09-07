<div class="soa-inline-editor-range" data-inline-editor-control>
    <input {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag([
        'class' => 'custom-range soa-inline-editor-control',
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
            data-inline-editor-range-output>{{ $value }}</output>
</div>
