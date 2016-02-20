<li>
	<a href="{{ $url }}">
		<i class="fa fa-fw {{ $icon }}"></i> {{ $label }}
		@if (count($items) > 0)
			<span class="fa arrow"></span>
		@endif
	</a>
	@if (count($items) > 0)
		<ul class="nav {{ array_get(['', 'nav-second-level', 'nav-third-level'], $level) }} collapse">
			@foreach ($items as $item)
				{!! $item !!}
			@endforeach
		</ul>
	@endif
</li>