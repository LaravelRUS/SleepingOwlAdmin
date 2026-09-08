@php($columnGroupAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['row', 'soa-form-grid']))
<div {!! $columnGroupAttributes !!}>
	@foreach ($columns as $column)
		{!! $column->render() !!}
	@endforeach
</div>
