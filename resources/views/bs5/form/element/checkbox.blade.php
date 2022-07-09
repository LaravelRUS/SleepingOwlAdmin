@if ($visibled)
    <div class="form-group form-element-checkbox {{ $class ? ' ' . $class : '' }} {{ $errors->has($name) ? 'has-error' : '' }}"{!! $style ? ' style="' . $style . '"' : '' !!}>
        <div class="checkbox">
            <label class="{{ $required ? 'required' : '' }}">
                <input {!! $attributes !!} @if($readonly) disabled @endif type="checkbox" value="1" {!! $value ? 'checked="checked"' : '' !!} />

                {!! $label !!}
                @if($required)
                    <span class="form-element-required">*</span>
                @endif
            </label>

            @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        </div>

        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
