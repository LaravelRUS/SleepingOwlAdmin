<div class="form-group form-element-textarea {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="form-element-required">*</span>
		@endif
	</label>

	@include(AdminTemplate::getViewPath('form.element.partials.helptext'))

	<textarea class="form-control"
			  rows="{{ $rows }}"
			  name="{{ $name }}"
			  @if($readonly) readonly @endif
	>{!! $value !!}</textarea>
	@include(AdminTemplate::getViewPath('form.element.partials.errors'))
</div>