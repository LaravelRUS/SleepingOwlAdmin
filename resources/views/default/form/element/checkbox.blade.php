<div class="form-group form-element-checkbox {{ $errors->has($name) ? 'has-error' : '' }}">
	<div class="checkbox">
		<label>
			<input type="checkbox" name="{{ $name }}" value="1" {!! $value ? 'checked="checked"' : '' !!} />

			{{ $label }}
		</label>

		@include(AdminTemplate::getViewPath('form.element.partials.helptext'))
	</div>

	@include(AdminTemplate::getViewPath('form.element.partials.errors'))
</div>