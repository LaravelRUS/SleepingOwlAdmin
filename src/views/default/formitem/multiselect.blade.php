<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}">{{ $label }}</label>
	<div>
		<select id="{{ $name }}" name="{{ $name }}[]" class="form-control multiselect" multiple="multiple">
			@foreach ($options as $optionValue => $optionLabel)
				<option value="{{ $optionValue }}" {!! in_array($optionValue, $value) ? 'selected="selected"' : '' !!}>{{ $optionLabel }}</option>
			@endforeach
		</select>
	</div>
	@include(AdminTemplate::view('formitem.errors'))
</div>