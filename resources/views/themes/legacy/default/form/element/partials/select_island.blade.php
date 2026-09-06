@php
    $selectAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($selectAttributesArray))
        ->class(['form-control'])
        ->getAttributes();
    $selectProps = [
        'attributes' => $selectAttributes,
        'labels' => [
            'deselect' => trans('sleeping_owl::lang.select.deselect'),
            'noItems' => trans('sleeping_owl::lang.select.no_items'),
            'placeholder' => trans('sleeping_owl::lang.select.placeholder'),
            'required' => trans('sleeping_owl::validation.required', ['attribute' => $label]),
            'select' => trans('sleeping_owl::lang.select.init'),
            'selected' => trans('sleeping_owl::lang.select.selected'),
        ],
        'limit' => (int) $limit,
        'max' => (int) $selectMax,
        'multiple' => $selectMultiple,
        'options' => $options,
        'readonly' => (bool) $readonly,
        'required' => (bool) $required,
        'taggable' => $selectTaggable,
        'value' => $value,
    ];
@endphp

<div
    v-pre
    data-soa-vue-app
    data-soa-vue-component="element-select"
    data-soa-vue-props="{{ json_encode($selectProps, JSON_THROW_ON_ERROR) }}"
></div>
