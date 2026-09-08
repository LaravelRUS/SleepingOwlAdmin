@php
    $badgeAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class(['badge', 'soa-badge']);
@endphp
<small {!! $badgeAttributes !!}>{{ $value }}</small>
