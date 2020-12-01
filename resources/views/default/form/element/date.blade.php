@if ($visibled)
    <div class="form-group form-element-date {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="control-label {{ $required ? 'required' : '' }}">
            {{ $label }}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        <div class="input-group input-date date">
            <input {!! $attributes !!} value="{{$value}}"
                   @if($readonly) readonly @endif />

            <div class="input-group-prepend input-group-addon">
                <div class="input-group-text">
                    <span class="far fa-calendar-alt"></span>
                </div>
            </div>
        </div>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
