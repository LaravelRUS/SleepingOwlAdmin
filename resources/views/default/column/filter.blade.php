@if ( ! is_null($value))
	<a href="{{ $url }}" class="btn btn-link btn-outline">
		<i class="fa {{ $icon }}" data-toggle="tooltip" title="{{ $title }}"></i>
	</a>
@endif
