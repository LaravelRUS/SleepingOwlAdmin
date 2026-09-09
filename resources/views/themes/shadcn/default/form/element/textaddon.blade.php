@if ($visibled)
    <div class="form-group soa-field form-element-textaddon mb-3 {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="form-label control-label soa-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required soa-required">*</span>
            @endif
        </label>
        <div class="input-group soa-input-group">
            @if ($placement == 'before')
                <span class="input-group-text soa-input-addon">{!! $addon !!}</span>
            @endif
            <input v-pre {!! (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['form-control', 'soa-input']) !!} value="{{ $value }}">
            @if ($placement == 'after')
                <span class="input-group-text soa-input-addon">{!! $addon !!}</span>
            @endif
        </div>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
