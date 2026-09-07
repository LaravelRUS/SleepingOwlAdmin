<input {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag([
    'class' => 'soa-inline-editor-control',
    'data-inline-editor-control' => true,
    'max' => $max ?? null,
    'min' => $min ?? null,
    'step' => $step ?? null,
    'type' => 'number',
    'value' => $value,
]) !!}>
