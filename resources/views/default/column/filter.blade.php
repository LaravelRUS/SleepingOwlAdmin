@if ( ! is_null($value))
	<a href="{{ $url }}" class="btn btn-sm btn btn-default pull-right">
		<i class="{{ $icon }}" data-toggle="tooltip" title="{{ $title }}"></i>
	</a>
@endif
