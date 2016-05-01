<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="text-danger">*</span>
		@endif
	</label>
	<textarea class="form-control"
			  rows="{{ $rows }}"
			  name="{{ $name }}"
			  @if($readonly) readonly @endif
	>{!! $value !!}</textarea>
	@include(AdminTemplate::getViewPath('form.element.errors'))
</div>