<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}">{{ $label }}</label>
	<textarea class="form-control" rows="{{ $rows }}" name="{{ $name }}" @if(isset($readonly))readonly="{{ $readonly }}"@endif>{!! $value !!}</textarea>
	@include(AdminTemplate::getViewPath('form.element.errors'))
</div>