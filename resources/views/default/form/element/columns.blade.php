@php($columnGroupAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['row']))
<div {!! $columnGroupAttributes !!}>
	@foreach ($columns as $column)
		{!! $column->render() !!}
	@endforeach
</div>
