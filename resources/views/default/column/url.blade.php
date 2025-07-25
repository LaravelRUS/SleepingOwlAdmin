<div {!! $attributes !!}>
	@if ($visibled)
        @php
            $attrs = '';
            foreach ($linkAttributes as $attr => $val) {
                if (is_bool($val)) {
                    if ($val) $attrs .= ' ' . $attr;
                } else {
                    $attrs .= ' ' . $attr . '="' . e($val) . '"';
                }
            }
        @endphp
		@if (!empty($value))
			<a href="{{ $value }}" {!! $attrs !!} target="_blank">
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
