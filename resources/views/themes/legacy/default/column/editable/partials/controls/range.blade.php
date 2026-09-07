<div class="soa-inline-editor-range" data-inline-editor-control>
    <input {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag([
        'class' => 'soa-inline-editor-control',
        'data-inline-editor-range-input' => true,
        'max' => $max ?? null,
        'min' => $min ?? null,
        'step' => $step ?? null,
        'type' => 'range',
        'value' => $value,
    ]) !!}>
    <output class="soa-inline-editor-range-value"
            data-inline-editor-range-output>{{ $value }}</output>
</div>
