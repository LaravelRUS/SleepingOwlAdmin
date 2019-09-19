<div class="form-group form-element-select {{ $errors->has($name) ? 'has-error' : '' }}">
    <label for="{{ $id }}" class="control-label">
        {!! $label !!}

        @if($required)
            <span class="form-element-required">*</span>
        @endif
    </label>

    <div>
        {!! Form::select($name, collect($options)->pluck('text', 'id'), $value, $attributes_array) !!}
    </div>

    @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
    @include(AdminTemplate::getViewPath('form.element.partials.errors'))
</div>
