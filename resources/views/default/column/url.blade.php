@if (!empty($url))
<a href="{{ $value }}" {{ app('html')->attributes($linkAttributes) }}>
	<i class="fa fa-arrow-circle-o-right" data-toggle="tooltip" title="{{ trans('sleeping_owl::lang.table.filter-goto') }}"></i>
</a>
@endif
