<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
    <label for="{{ $name }}" class="control-label">
        {{ $label }}

        @if($required)
            <span class="text-danger">*</span>
        @endif
    </label>

    <div class="form-group input-group" style="width: 250px">
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
    @include(AdminTemplate::getViewPath('form.element.errors'))
</div>