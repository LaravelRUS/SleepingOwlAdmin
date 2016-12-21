<div class="form-group form-element-time {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="form-element-required">*</span>
		@endif
	</label>
	<div class="input-date input-group">
		<input data-date-format="{{ $pickerFormat }}"
			   data-date-pickdate="false"
			   data-date-useseconds="true"
			   class="form-control"
			   name="{{ $name }}"
			   type="text" id="{{ $name }}"
			   value="{{ $value }}"
			   @if($readonly) readonly @endif
		>
		<span class="input-group-addon"><span class="fa fa-clock-o"></span></span>
	</div>

	@include(AdminTemplate::getViewPath('form.element.partials.helptext'))
	@include(AdminTemplate::getViewPath('form.element.partials.errors'))
</div>