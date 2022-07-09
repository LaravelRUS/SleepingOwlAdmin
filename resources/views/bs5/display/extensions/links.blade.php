<div {!! $attributes !!}>
    @foreach($links as $link)
        @if ($link instanceof \SleepingOwl\Admin\Display\Link)
            <a {!! $link->attributes() !!} href="{!! $link->getUrl() !!}">{!! $link->getTitle() !!}</a>
        @elseif ($link instanceof \Illuminate\Contracts\Support\Renderable)
            {!! $link->render() !!}
        @elseif (is_string($link))
            {!! $link !!}
        @endif
    @endforeach
</div>
