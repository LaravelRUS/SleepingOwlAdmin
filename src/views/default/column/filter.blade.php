@if ( ! is_null($value))
	<a href="{{ $url }}"><i class="fa {{ $isSelf ? 'fa-filter' : 'fa-arrow-circle-o-right' }}" data-toggle="tooltip" title="{{ $isSelf ? trans('admin::lang.table.filter') : trans('admin::lang.table.filter-goto') }}"></i></a>
@endif