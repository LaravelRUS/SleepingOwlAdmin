@if ($visibled)
    <div class="form-group form-element-radio {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        @foreach ($options as $option)
            <div class="radio">
                <label>
                    <input {!! ($value == $option['id']) ? 'checked ' : '' !!}{!! $htmlStringAttributes !!}
                           name="{{ $name }}"
                           value="{{ $option['id'] }}"
                    />
                    {!! $option['text'] !!}
                </label>
            </div>
        @endforeach

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
