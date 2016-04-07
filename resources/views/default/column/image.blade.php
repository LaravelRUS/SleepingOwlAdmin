@if ( ! empty($value))
	<a href="{{ $value }}" data-toggle="lightbox">
		<img class="thumbnail" src="{{ $value }}" width="{{ $width }}">
	</a>
@endif
{!! $append !!}