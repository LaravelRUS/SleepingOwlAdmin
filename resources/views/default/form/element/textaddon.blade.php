<div class="form-group form-element-textaddon {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="form-element-required">*</span>
		@endif
	</label>
	<div class="input-group">
		@if ($placement == 'before')
			<span class="input-group-addon">{!! $addon !!}</span>
		@endif
		<input class="form-control" name="{{ $name }}" type="text" id="{{ $name }}" value="{{ $value }}">
		@if ($placement == 'after')
			<span class="input-group-addon">{!! $addon !!}</span>
		@endif
	</div>

	@include(AdminTemplate::getViewPath('form.element.partials.helptext'))
	@include(AdminTemplate::getViewPath('form.element.partials.errors'))
</div>