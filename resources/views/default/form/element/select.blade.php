<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="text-danger">*</span>
		@endif
	</label>

	{!! Form::select($name, $options, $value, $attributes) !!}
	@include(AdminTemplate::getViewPath('form.element.errors'))
</div>