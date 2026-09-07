@php
    $selectAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($selectAttributesArray))
        ->class(['form-control'])
        ->getAttributes();
    $selectProps = array_replace([
        'attributes' => $selectAttributes,
        'classes' => [
            'required' => 'text-danger pt-2 pb-3',
        ],
        'labels' => [
            'deselect' => trans('sleeping_owl::lang.select.deselect'),
            'error' => trans('sleeping_owl::lang.message.something_went_wrong'),
            'noItems' => trans('sleeping_owl::lang.select.no_items'),
            'placeholder' => trans('sleeping_owl::lang.select.placeholder'),
            'required' => trans('sleeping_owl::validation.required', ['attribute' => $label]),
            'searching' => trans('sleeping_owl::lang.table.loadingRecords'),
            'select' => trans('sleeping_owl::lang.select.init'),
            'selected' => trans('sleeping_owl::lang.select.selected'),
            'tooShort' => trans('sleeping_owl::lang.select.short', [
                'min' => $remoteSelect['minSymbols'] ?? 0,
            ]),
        ],
        'legacyOptions' => $select2Options ?? [],
        'limit' => (int) $limit,
        'max' => (int) $selectMax,
        'multiple' => $selectMultiple,
        'options' => $options,
        'readonly' => (bool) $readonly,
        'required' => (bool) $required,
        'taggable' => $selectTaggable,
        'value' => $value,
    ], $selectExtraProps ?? []);
@endphp

<div
    v-pre
    data-soa-vue-app
    data-soa-vue-component="element-select"
    data-soa-vue-props="{{ json_encode($selectProps, JSON_THROW_ON_ERROR) }}"
></div>
