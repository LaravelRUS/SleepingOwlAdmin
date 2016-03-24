<button {!! $attributes !!}>
	@if ($icon)
	<i class="{{ $icon }}"></i>
	@endif

	{{ $title }}
</button>