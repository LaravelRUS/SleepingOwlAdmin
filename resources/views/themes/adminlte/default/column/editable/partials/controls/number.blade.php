<input {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag([
    'class' => 'soa-inline-editor-control',
    'data-inline-editor-control' => true,
    'id' => $editorControlId,
    'max' => $max ?? null,
    'min' => $min ?? null,
    'name' => $name,
    'required' => ($required ?? false) ? true : null,
    'step' => $step ?? null,
    'type' => 'number',
    'value' => $value,
]) !!}>
