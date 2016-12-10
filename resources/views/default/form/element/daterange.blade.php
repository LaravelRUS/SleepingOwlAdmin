<div class="form-group form-element-daterange {{ $errors->has($name) ? 'has-error' : '' }}">
    <label for="{{ $name }}" class="control-label">
        {{ $label }}

        @if($required)
            <span class="form-element-required">*</span>
        @endif
    </label>

    <div class="input-group">
        <input data-format="{{ $pickerFormat }}"
               data-startDate="{{ $startDate }}"
               data-endDate="{{ $endDate }}"
               class="form-control input-daterange"
               name="{{ $name }}"
               type="text"
               id="{{ $name }}"
               value="{{ $value }}"
               @if($readonly) readonly @endif
        >
        <span class="input-group-addon">
            <span class="fa fa-calendar"></span>
        </span>
    </div>

    @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
    @include(AdminTemplate::getViewPath('form.element.partials.errors'))
</div>