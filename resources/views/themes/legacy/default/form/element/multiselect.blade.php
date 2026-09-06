@if ($visibled)
    <div class="form-group form-element-multiselect {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $id }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
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
