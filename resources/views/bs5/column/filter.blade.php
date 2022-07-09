@if ( ! is_null($value))
	<a href="{{ $url }}" class="btn btn-xs btn-default pull-right" data-toggle="tooltip" title="{{ $title }}">
		<i class="{{ $icon }}"></i>
	</a>
@endif
