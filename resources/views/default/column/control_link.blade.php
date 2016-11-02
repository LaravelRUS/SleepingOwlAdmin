<a href="{{ $url }}" {!! $attributes !!}>
    @if($icon)
        <i class="{{ $icon }}"></i>
    @endif

    @if(!$hideText)
        {!! $text !!}
    @endif
</a>