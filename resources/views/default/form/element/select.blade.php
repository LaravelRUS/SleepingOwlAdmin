<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="text-danger">*</span>
		@endif
	</label>
	<div>
		<select id="{{ $name }}" name="{{ $name }}" class="form-control input-select" size="2" data-select-type="single" {!! ($nullable) ? 'data-nullable="true"' : '' !!}>
			@if ($nullable)
				<option value=""></option>
			@endif
			@foreach ($options as $optionValue => $optionLabel)
				<option value="{{ $optionValue }}" {!! ($value == $optionValue) ? 'selected="selected"' : '' !!}>{{ $optionLabel }}</option>
			@endforeach
		</select>
	</div>
	@include(AdminTemplate::getViewPath('form.element.errors'))
</div>