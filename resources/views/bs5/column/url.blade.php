<div {!! $attributes !!}>
	@if ($visibled)
		@if (!empty($value))
			<a href="{{ $value }}" {{ app('html')->attributes($linkAttributes) }} target="_blank">
				@if($icon)
					<i class="{{ $icon }}" data-toggle="tooltip" title="{{ trans('sleeping_owl::lang.table.filter-goto') }}"></i>
				@endif

				@if($text)
					{{ $text }}
				@endif

			</a>
		@endif
		{!! $append !!}

		@if($small)
			<small class="clearfix">{!! $small !!}</small>
		@endif
	@endif
</div>
