@if ($visibled)
    <div class="form-group form-element-text {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        <div class="position-relative">
            <input v-pre {!! $attributes !!} value="{{$value}}"
                   @if($readonly) readonly @endif
                   @if($canGenerate)
                        data-generate-length="{{ $generateLength }}"
                        @if($generateChars) data-generate-chars="{{ $generateChars }}" @endif
                   @endif
            >

            @if($canGenerate && !$readonly)
                <div class="control-button {{ isset($datalistOptions) && $datalistOptions ? 'pr-4' : '' }}">
                    <span class="btn btn-sm text-muted generate">
                        <i class="fa-solid fa-plus"></i>
                    </span>
                </div>
            @endif
        </div>

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
