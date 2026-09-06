@if ($visibled)
<div {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []) !!} {!! $width !!}>
	{!! $from !!}
	{!! $to !!}
</div>
@endif
