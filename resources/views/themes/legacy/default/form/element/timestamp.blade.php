@if ($visibled)
    <div class="form-group form-element-timestamp {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        <div class="input-date input-group datetime">
            <input {!! (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['form-control']) !!}
                   value="{{ $value }}"
                   @if($readonly) readonly @endif
            >
            <span class="input-group-text">
                <span class="far fa-calendar-alt"></span>
            </span>

        </div>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
