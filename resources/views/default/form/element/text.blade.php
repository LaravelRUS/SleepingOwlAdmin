@if ($visibled)
    <div class="form-group form-element-text {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>
        <input v-pre {!! $attributes !!} value="{{$value}}"
               @if($readonly) readonly @endif
        >

        @if(isset($datalistOptions) && $datalistOptions && is_array($datalistOptions))
            <datalist id="{{ $id }}Datalist">
                @foreach($datalistOptions as $item)
                    <option value="{{ $item }}"></option>
                @endforeach
            </datalist>
        @endif

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
