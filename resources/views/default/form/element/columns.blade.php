@php($columnGroupAttributes = (new \Illuminate\View\ComponentAttributeBag($attributesArray))->class(['row']))
<div {!! $columnGroupAttributes !!}>
	@foreach ($columns as $column)
		{!! $column->render() !!}
	@endforeach
</div>
