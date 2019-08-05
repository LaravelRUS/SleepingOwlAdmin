@if (!empty($value))
<a href="{{ $value }}" {{ app('html')->attributes($linkAttributes) }}>
	<i class="fas fa-link" data-toggle="tooltip" title="{{ trans('sleeping_owl::lang.table.filter-goto') }}"></i>
</a>
@endif
{!! $append !!}
