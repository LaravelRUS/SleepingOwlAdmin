<div class="links-row" {!! $attributes !!}>
    @foreach($links as $link)
        <a  {!! $link->attributes() !!} href="{!! $link->getUrl() !!}">{!! $link->getTitle() !!}</a>
    @endforeach
</div>
