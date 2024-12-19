<div {!! $attributes !!}>
	@if ($visibled)
		@if (!empty($value))
            @if($icon)
                <i class="{{ $icon }}" data-toggle="tooltip" title="{{ trans('sleeping_owl::lang.table.filter-goto') }}"></i>
            @endif
            {{
              app('A')
                ->attributes(array_merge($linkAttributes, ['target'=> '_blank']))
                ->href($value)
                ->text($text)
            }}
		@endif
		{!! $append !!}

		@if($small)
			<small class="clearfix">{!! $small !!}</small>
		@endif
	@endif
</div>
