<div class="form-group form-element-select {{ $errors->has($name) ? 'has-error' : '' }}">
    <label for="{{ $name }}" class="control-label">
        {{ $label }}

        @if($required)
            <span class="form-element-required">*</span>
        @endif
    </label>

    <div>
        {!! Form::select($name, $options, $value, $attributes) !!}
    </div>

    @include($template->getViewPath('form.element.partials.helptext'))
    @include($template->getViewPath('form.element.partials.errors'))
</div>