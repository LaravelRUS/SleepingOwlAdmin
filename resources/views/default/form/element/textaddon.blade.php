@if ($visibled)
    <div class="form-group form-element-textaddon {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>
        <div class="input-group">
            @if ($placement == 'before')
                <div class="input-group-prepend">
                    <span class="input-group-text">{!! $addon !!}</span>
                </div>
            @endif
            <input v-pre {!! $attributes !!} value="{{ $value }}">
            @if ($placement == 'after')
                <div class="input-group-append">
                    <span class="input-group-text">{!! $addon !!}</span>
                </div>
            @endif
        </div>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
