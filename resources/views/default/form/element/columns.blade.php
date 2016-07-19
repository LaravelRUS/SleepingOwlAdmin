<div {!! $attributes !!}>
	@foreach ($columns as $column)
		{!! $column->render() !!}
	@endforeach
</div>
