<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="text-danger">*</span>
		@endif
	</label>
	<input class="form-control"
		   name="{{ $name }}"
		   type="number"
		   id="{{ $name }}"
		   max="{{ $max }}"
		   min="{{ $min }}"
		   step="{{ $step }}"
		   value="{{ $value }}"
		   @if($readonly) readonly @endif
	>
	@include(AdminTemplate::getViewPath('form.element.errors'))
</div>