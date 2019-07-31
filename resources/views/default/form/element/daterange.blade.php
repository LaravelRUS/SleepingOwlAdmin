<div class="form-group form-element-daterange {{ $errors->has($name) ? 'has-error' : '' }}">
    <label for="{{ $name }}" class="control-label {{ $required ? 'required' : '' }}">
        {{ $label }}

        @if($required)
            <span class="form-element-required">*</span>
        @endif
    </label>

    <div class="input-daterange input-group" id="datepicker">
      <input type="text"
        {{-- {!! $attributes !!} --}}
        value="{{ $value }}"
        @if($readonly) readonly @endif
        class="input-sm form-control" name="start" />
      <span class="input-group-addon-data">-</span>
      <input
        {{-- {!! $attributes !!} --}}
        value="{{ $value }}"
        @if($readonly) readonly @endif
        type="text" class="input-sm form-control" name="end" />
    </div>

    @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
    @include(AdminTemplate::getViewPath('form.element.partials.errors'))
</div>
