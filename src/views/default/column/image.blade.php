<td>
	@if ( ! empty($value))
		<a href="{{ $value }}" data-toggle="lightbox">
			<img class="thumbnail" src="{{ $value }}" width="80px">
		</a>
	@endif
	{!! $append !!}
</td>