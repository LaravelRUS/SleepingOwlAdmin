@php
    $skeletonAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class(['soa-skeleton'])
        ->merge(['aria-hidden' => 'true']);
@endphp
<span {!! $skeletonAttributes !!}></span>
