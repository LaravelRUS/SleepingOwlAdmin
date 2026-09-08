@if ($visibled)
    <div class="form-group soa-field form-element-select mb-3 {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $id }}" class="form-label control-label soa-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required soa-required">*</span>
            @endif
        </label>

        @include(AdminTemplate::getViewPath('form.element.partials.select_island'), [
            'selectAttributesArray' => $attributesArray,
            'selectExtraProps' => ['remote' => $remoteSelect],
            'selectMax' => $max ?? 0,
            'selectMultiple' => array_key_exists('multiple', $attributesArray),
            'selectTaggable' => false,
        ])

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
