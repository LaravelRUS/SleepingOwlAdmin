<div class="form-group form-element-select {{ $errors->has($name) ? 'has-error' : '' }}">
    <label for="{{ $id }}" class="control-label">
        {!! $label !!}

        @if($required)
            <span class="form-element-required">*</span>
        @endif
    </label>

    <div>
{{--        {!! Form::select($name, collect($options)->pluck('text', 'id'), $value, $attributes_array) !!}--}}

        @php
            $attrs = collect($attributes_array ?? [])->map(function($v, $k) {
                return $k . '="' . e($v) . '"';
            })->implode(' ');
        @endphp

        <select name="{{ $name }}" {{ $attrs }}>
            @foreach($options as $option)
                <option value="{{ $option['id'] }}" @selected($option['id'] == $value)>
                    {{ $option['text'] }}
                </option>
            @endforeach
        </select>
    </div>

    @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
    @include(AdminTemplate::getViewPath('form.element.partials.errors'))
</div>
