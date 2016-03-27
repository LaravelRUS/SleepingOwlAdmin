<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="text-danger">*</span>
		@endif
	</label>
	@if ($nullable)
		<div class="radio">
			<label>
				<input type="radio" name="{{ $name }}" value="" {!! ($value == null) ? 'checked' : '' !!}/>
				{{ trans('sleeping_owl::lang.select.nothing') }}
			</label>
		</div>
	@endif
	@foreach ($options as $optionValue => $optionLabel)
		<div class="radio">
			<label>
				<input type="radio" name="{{ $name }}" value="{{ $optionValue }}" {!! ($value == $optionValue) ? 'checked' : '' !!}/>
				{{ $optionLabel }}
			</label>
		</div>
	@endforeach
	@include(AdminTemplate::getViewPath('form.element.errors'))
</div>