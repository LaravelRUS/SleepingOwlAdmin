@if ($visibled)
    <div class="form-group soa-field form-element-wysiwyg mb-3 {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="form-label control-label soa-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required soa-required">*</span>
            @endif
        </label>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))

        {!! html()->textarea($name, $value)->attributes(
            (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['soa-textarea'])->getAttributes()
        ) !!}

        @include(app('sleeping_owl.template')->getViewPath('form.element.partials.errors'))
    </div>
@endif
