<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}">{{ $label }}</label>
	<input class="form-control" name="{{ $name }}" type="text" id="{{ $name }}" value="{{ $value }}" @if(isset($readonly))readonly="{{ $readonly }}" @endif>
	@include(AdminTemplate::view('formitem.errors'))
</div>