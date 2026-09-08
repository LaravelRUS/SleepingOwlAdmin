@php($controlAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(array_merge(['btn', 'btn-sm', 'soa-button', 'soa-button-sm'], $themeClasses ?? [])))
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
