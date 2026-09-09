@php
    $editorSelectOptions = array_map(
        static fn (array $option): array => [
            'id' => $option['value'],
            'text' => $option['text'],
        ],
        $editorOptions
    );
@endphp

<div class="soa-inline-editor-select"
     data-inline-editor-control
     data-inline-editor-select
     tabindex="-1">
    @include(AdminTemplate::getViewPath('form.element.partials.select_island'), [
        'label' => strip_tags($editorTitle ?? $name),
        'limit' => $limit ?? 0,
        'options' => $editorSelectOptions,
        'readonly' => false,
        'remoteSelect' => null,
        'required' => (bool) ($required ?? false),
        'select2Options' => $select2Options ?? [],
        'selectAttributesArray' => [
            'data-inline-editor-select-native' => true,
            'id' => $editorControlId,
            'name' => $name,
            'required' => ($required ?? false) ? true : null,
        ],
        'selectExtraProps' => [],
        'selectMax' => 0,
        'selectMultiple' => false,
        'selectTaggable' => false,
        'value' => $value,
    ])
</div>
