<div class="soa-inline-editor-range" data-soa-inline-editor-control>
    <input {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag([
        'class' => 'soa-inline-editor-control',
        'data-soa-inline-editor-range-input' => true,
        'max' => $max ?? null,
        'min' => $min ?? null,
        'step' => $step ?? null,
        'type' => 'range',
        'value' => $value,
    ]) !!}>
    <output class="soa-inline-editor-range-value"
            data-soa-inline-editor-range-output>{{ $value }}</output>
</div>
