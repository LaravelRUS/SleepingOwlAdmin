<div class="form-group form-element-checkbox {{ $class ? ' ' . $class : '' }} {{ $errors->has($name) ? 'has-error' : '' }}"{!! $style ? ' style="' . $style . '"' : '' !!}>
<div class="checkbox">
		<label>
			<input {!! $attributes !!} @if($readonly) disabled @endif type="checkbox" value="1" {!! $value ? 'checked="checked"' : '' !!} />

			{!! $label !!}
		</label>

		@include(AdminTemplate::getViewPath('form.element.partials.helptext'))
	</div>

	@include(AdminTemplate::getViewPath('form.element.partials.errors'))
</div>
