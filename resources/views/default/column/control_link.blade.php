@php($controlAttributes = (new \Illuminate\View\ComponentAttributeBag($attributesArray))->class(array_merge(['btn', 'btn-xs'], $themeClasses ?? [])))
<a href="{{ $url }}" {!! $controlAttributes !!}>
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
