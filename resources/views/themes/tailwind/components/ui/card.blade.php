@php
    $cardAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class(['soa-card']);
@endphp
<section {!! $cardAttributes !!}>
    @if(isset($header) || isset($title))
        <header class="soa-card-header">
            @if(isset($title))<h2 class="soa-card-title">{!! $title !!}</h2>@endif
            {!! $header ?? '' !!}
        </header>
    @endif
    <div class="soa-card-body">{!! $content ?? '' !!}</div>
    @if(isset($footer))<footer class="soa-card-footer">{!! $footer !!}</footer>@endif
</section>
