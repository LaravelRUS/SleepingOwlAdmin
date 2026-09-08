@if ( ! is_null($value))
	<a href="{{ $url }}" class="btn btn-sm btn-light float-end soa-button soa-button-sm soa-button-ghost" data-toggle="tooltip" data-bs-toggle="tooltip" title="{{ $title }}">
		<i class="{{ $icon }}"></i>
	</a>
@endif
