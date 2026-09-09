<form action="{{ $url }}" method="POST" style="display:inline-block;">
    <input type="hidden" name="_token" value="{{ csrf_token() }}" />
    <input type="hidden" name="_method" value="{{ $method }}" />
    @php($controlAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(array_merge(['btn', 'btn-sm', 'soa-button', 'soa-button-sm'], $themeClasses ?? [])))
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
