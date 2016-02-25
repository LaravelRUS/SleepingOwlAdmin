<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}">{{ $label }}</label>
	<textarea class="form-control ckeditor" name="{{ $name }}">{!! $value !!}</textarea>
	@include(AdminTemplate::getViewPath('form.element.errors'))
</div>