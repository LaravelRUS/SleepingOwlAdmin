<div {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []) !!}>
	@if ($visibled)
		@if (!empty($value))
			<a href="{{ $value }}" data-lightbox>
				@if ($lazy)
					<img class="thumbnail lazyload soa-thumbnail" src="{{ config('sleeping_owl.imageLazyLoadFile') }}" data-src="{{ $value }}" width="{{ $imageWidth }}">
				@else
					<img class="thumbnail soa-thumbnail" src="{{ $value }}" width="{{ $imageWidth }}">
				@endif
			</a>
		@endif
		{!! $append !!}

		@if($small)
			<small class="clearfix">{!! $small !!}</small>
		@endif
	@endif
</div>
