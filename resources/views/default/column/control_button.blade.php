<form action="{{ $url }}" method="POST" style="display:inline-block;">
    <input type="hidden" name="_token" value="{{ csrf_token() }}" />
    <input type="hidden" name="_method" value="{{ $method }}" />
    <button {!! $attributes !!}>
        @if($icon)
            <i class="{{ $icon }}"></i>
        @endif

        @if($image)
            <img src="{{ $image }}">
        @endif

        @if(!$hideText)
            {!! $text !!}
        @endif
    </button>
</form>
