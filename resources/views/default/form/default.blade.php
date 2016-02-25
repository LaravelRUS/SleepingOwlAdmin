<form action="{{ $action }}" method="POST">

	<input type="hidden" name="_token" value="{{ csrf_token() }}" />

	@foreach ($items as $item)
		{!! $item->render() !!}
	@endforeach

	{!! $buttons->render() !!}
</form>