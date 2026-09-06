<form action="{{ $url }}" method="POST" style="display:inline-block;">
    <input type="hidden" name="_token" value="{{ csrf_token() }}" />
    <input type="hidden" name="_method" value="{{ $method }}" />
    @php($controlAttributes = (new \Illuminate\View\ComponentAttributeBag($attributesArray))->class(array_merge(['btn', 'btn-xs'], $themeClasses ?? [])))
    <button {!! $controlAttributes !!}>
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
