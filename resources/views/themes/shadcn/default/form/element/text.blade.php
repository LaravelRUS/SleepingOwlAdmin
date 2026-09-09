@if ($visibled)
    <div class="form-group soa-field form-element-text mb-3 {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="form-label control-label soa-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required soa-required">*</span>
            @endif
        </label>

        <div class="position-relative soa-input-wrap">
            <input v-pre {!! (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['form-control', 'soa-input']) !!} value="{{$value}}"
                   @if($readonly) readonly @endif
                   @if($canGenerate)
                        data-generate-length="{{ $generateLength }}"
                        @if($generateChars) data-generate-chars="{{ $generateChars }}" @endif
                   @endif
            >

            @if($canGenerate && !$readonly)
                <div class="control-button soa-input-actions {{ isset($datalistOptions) && $datalistOptions ? 'pe-4' : '' }}">
                    <span class="btn btn-sm text-muted generate soa-icon-button">
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
