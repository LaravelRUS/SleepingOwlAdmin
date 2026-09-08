@php
    $groupAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class(['soa-input-group']);
@endphp
<div {!! $groupAttributes !!}>
    @if(isset($prefix))<span class="soa-input-addon">{!! $prefix !!}</span>@endif
    {!! $content ?? '' !!}
    @if(isset($suffix))<span class="soa-input-addon">{!! $suffix !!}</span>@endif
</div>
