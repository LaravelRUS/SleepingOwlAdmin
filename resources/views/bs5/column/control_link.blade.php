<a href="{{ $url }}" {!! $attributes !!}>
    @if($icon)
        <i class="{{ $icon }}"></i>
    @endif

    @if($image)
        <img src="{{ $image }}">
    @endif

    @if(!$hideText)
        {!! $text !!}
    @endif
</a>
