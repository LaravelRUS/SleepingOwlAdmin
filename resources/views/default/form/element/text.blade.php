<div class="form-group form-element-text {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="form-element-required">*</span>
		@endif
	</label>
	<input class="form-control"
		   name="{{ $name }}"
		   type="text"
		   id="{{ $name }}"
		   value="{{ $value }}"
		   @if($readonly) readonly @endif
	>

	@include(AdminTemplate::getViewPath('form.element.partials.helptext'))
	@include(AdminTemplate::getViewPath('form.element.partials.errors'))
</div>