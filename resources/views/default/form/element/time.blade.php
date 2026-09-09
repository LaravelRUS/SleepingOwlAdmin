@if ($visibled)
    <div class="form-group soa-field form-element-time mb-3 {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="form-label control-label soa-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required soa-required">*</span>
            @endif
        </label>
        <div class="input-date input-group datetime soa-input-group">
            <input {!! (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['form-control', 'soa-input']) !!}
                   value="{{ $value }}"
                   @if($readonly) readonly @endif
            >
            <span class="input-group-text soa-input-addon">
                <span class="fas fa-clock"></span>
            </span>
        </div>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
