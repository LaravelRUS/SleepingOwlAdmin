@if ($visibled)
    <div class="form-group form-element-password {{ $errors->has($name) ? 'has-error' : '' }} {{ $canGenerate ? 'psswd-generate' : '' }}">
        <label for="{{ $name }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>
        <div class="password-field">
            <input v-pre {!! $attributes !!}
            value="{{$value}}"
                   @if($readonly) readonly @endif
                   autocomplete="off"
                   @if($canGenerate) data-generate-length="{{ $generateLength }}" @endif
            >
            <div class="control-button">
                <span class="btn btn-sm text-muted button-show">
                    <i class="fa-solid fa-eye"></i>
                </span>

                @if($canGenerate)
                    <span class="btn btn-sm text-muted generate">
                        <i class="fa-solid fa-plus"></i>
                    </span>
                @endif
            </div>
        </div>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
