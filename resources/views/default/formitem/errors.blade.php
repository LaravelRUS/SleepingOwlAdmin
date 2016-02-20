@foreach ($errors->get($name) as $error)
	<p class="help-block">{{ $error }}</p>
@endforeach
