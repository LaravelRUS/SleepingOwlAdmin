@if ($visibled)
    <div class="form-group soa-field form-element-password mb-3 {{ $errors->has($name) ? 'has-error' : '' }} {{ $canGenerate ? 'psswd-generate' : '' }}">
        <label for="{{ $name }}" class="form-label control-label soa-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required soa-required">*</span>
            @endif
        </label>
        <div class="password-field soa-input-wrap">
            <input v-pre {!! (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['form-control', 'pe-5', 'soa-input']) !!}
            value="{{$value}}"
                   @if($readonly) readonly @endif
                   autocomplete="off"
                   @if($canGenerate)
                       data-generate-length="{{ $generateLength }}"
                       @if($generateChars) data-generate-chars="{{ $generateChars }}" @endif
                   @endif
            >
            <div class="control-button soa-input-actions">
                <span class="btn btn-sm text-muted button-show soa-icon-button">
                    <i class="fa-solid fa-eye"></i>
                </span>

                @if($canGenerate && !$readonly)
                    <span class="btn btn-sm text-muted generate soa-icon-button">
                        <i class="fa-solid fa-plus"></i>
                    </span>
                @endif
            </div>
        </div>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
