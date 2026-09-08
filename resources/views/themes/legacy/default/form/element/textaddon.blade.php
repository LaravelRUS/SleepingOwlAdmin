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
                <span class="input-group-text">{!! $addon !!}</span>
            @endif
            <input v-pre {!! (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['form-control']) !!} value="{{ $value }}">
            @if ($placement == 'after')
                <span class="input-group-text">{!! $addon !!}</span>
            @endif
        </div>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
