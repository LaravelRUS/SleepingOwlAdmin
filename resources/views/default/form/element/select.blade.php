@if ($visibled)
    <div class="form-group form-element-select mb-3 {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $id }}" class="form-label control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        @include(AdminTemplate::getViewPath('form.element.partials.select_island'), [
            'selectAttributesArray' => $attributesArray,
            'selectMax' => 0,
            'selectMultiple' => false,
            'selectTaggable' => false,
        ])

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
