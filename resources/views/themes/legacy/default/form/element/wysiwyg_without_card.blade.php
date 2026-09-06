@if ($visibled)
    <div class="form-group form-element-wysiwyg {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))

        {!! html()->textarea($name, $value)->attributes($attributesArray) !!}

        @include(app('sleeping_owl.template')->getViewPath('form.element.partials.errors'))
    </div>
@endif
