<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="text-danger">*</span>
		@endif
	</label>
	<div class="form-group input-group">
		@if ($placement == 'before')
			<span class="input-group-addon">{!! $addon !!}</span>
		@endif
		<input class="form-control" name="{{ $name }}" type="text" id="{{ $name }}" value="{{ $value }}">
		@if ($placement == 'after')
			<span class="input-group-addon">{!! $addon !!}</span>
		@endif
	</div>
	@include(AdminTemplate::getViewPath('form.element.errors'))
</div>