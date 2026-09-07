<input {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag([
    'class' => 'soa-inline-editor-control',
    'data-soa-inline-editor-control' => true,
    'max' => $max ?? null,
    'min' => $min ?? null,
    'step' => $step ?? null,
    'type' => 'number',
    'value' => $value,
]) !!}>
