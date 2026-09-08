@if ( ! is_null($value))
	<a href="{{ $url }}" class="btn btn-xs btn-light float-end" data-toggle="tooltip" data-bs-toggle="tooltip" title="{{ $title }}">
		<i class="{{ $icon }}"></i>
	</a>
@endif
