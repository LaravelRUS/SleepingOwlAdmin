@php
    $groupAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class(['soa-button-group', 'soa-button-group-vertical' => ($vertical ?? false)])
        ->merge(['role' => $role ?? 'group']);
@endphp
<div {!! $groupAttributes !!}>{!! $content ?? '' !!}</div>
