@include(AdminTemplate::getViewPath('form.partials.elements'), ['items' => $elements])

<div {!! $attributes !!}}>
	@foreach ($columns as $column)
		{!! $column->render() !!}
	@endforeach
</div>
