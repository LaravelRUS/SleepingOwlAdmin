@if ( ! empty($value))
	<a href="{{ $value }}" data-toggle="lightbox">
		<img class="thumbnail" src="{{ $value }}" width="{{ $imageWidth }}">
	</a>
@endif
{!! $append !!}