@if ($visibled)
    <div class="form-group soa-field form-element-multiselect mb-3 {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $id }}" class="form-label control-label soa-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required soa-required">*</span>
            @endif
        </label>

        @include(AdminTemplate::getViewPath('form.element.partials.select_island'), [
            'selectAttributesArray' => $attributesArray,
            'selectMax' => $max ?? 0,
            'selectMultiple' => true,
            'selectTaggable' => (bool) $taggable,
        ])

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
