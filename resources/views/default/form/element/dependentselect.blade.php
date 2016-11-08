<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="control-label">
                {{ $label }}

                @if($required)
                        <span class="text-danger">*</span>
                @endif
        </label>

        <div>
                {!! Form::select($name, $options, $value, $attributes) !!}
        </div>

        @include(AdminTemplate::getViewPath('form.element.errors'))
</div>
