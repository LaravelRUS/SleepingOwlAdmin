<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="text-danger">*</span>
		@endif
	</label>
	<div class="datepicker form-group input-group">
		<input data-date-format="{{ $pickerFormat }}"
			   data-date-pickdate="false"
			   data-date-useseconds="{{ $seconds ? 'true' : 'false' }}"
			   class="form-control"
			   name="{{ $name }}"
			   type="text" id="{{ $name }}"
			   value="{{ $value }}"
			   @if($readonly) readonly @endif
		>
		<span class="input-group-addon"><span class="fa fa-clock-o"></span></span>
	</div>
	@include(AdminTemplate::getViewPath('form.element.errors'))
</div>