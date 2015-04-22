<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}">{{ $label }}</label>
	<div>
		<select id="{{ $name }}" name="{{ $name }}" class="form-control multiselect" size="2" data-select-type="single" {!! ($nullable) ? 'multiple="multiple" data-nullable="true"' : '' !!}>
			@foreach ($options as $optionValue => $optionLabel)
				<option value="{{ $optionValue }}" {!! ($value == $optionValue) ? 'selected="selected"' : '' !!}>{{ $optionLabel }}</option>
			@endforeach
		</select>
	</div>
	@include(AdminTemplate::view('formitem.errors'))
</div>