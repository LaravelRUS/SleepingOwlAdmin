<button {!! HTML::attributes($attributes) !!}>
	@if ($icon)
	<i class="{{ $icon }}"></i>
	@endif

	{{ $title }}
</button>