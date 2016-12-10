<div class="form-group form-element-password {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="form-element-required">*</span>
		@endif
	</label>
	<input class="form-control"
		   name="{{ $name }}"
		   type="password"
		   id="{{ $name }}"
		   value=""
		   @if($readonly) readonly @endif
	>

	@include(AdminTemplate::getViewPath('form.element.partials.helptext'))
	@include(AdminTemplate::getViewPath('form.element.partials.errors'))
</div>