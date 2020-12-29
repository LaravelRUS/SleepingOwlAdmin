<div {!! $attributes !!}>
	@if ($visibled)
		@if (!empty($value))
			<a href="{{ $value }}" data-toggle="lightbox">
				@if ($lazy)
					<img class="thumbnail lazyload" src="{{ config('sleeping_owl.imageLazyLoadFile') }}" data-src="{{ $value }}" width="{{ $imageWidth }}">
				@else
					<img class="thumbnail" src="{{ $value }}" width="{{ $imageWidth }}">
				@endif
			</a>
		@endif
		{!! $append !!}

		@if($small)
			<small class="clearfix">{!! $small !!}</small>
		@endif
	@endif
</div>
