<div {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []) !!}>
    @foreach($links as $link)
        @if ($link instanceof \SleepingOwl\Admin\Display\Link)
            <a {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($link->getHtmlAttributes()) !!} href="{!! $link->getUrl() !!}">{!! $link->getTitle() !!}</a>
        @elseif ($link instanceof \Illuminate\Contracts\Support\Renderable)
            {!! $link->render() !!}
        @elseif (is_string($link))
            {!! $link !!}
        @endif
    @endforeach
</div>
