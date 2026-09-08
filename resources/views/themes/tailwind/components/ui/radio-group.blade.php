@php
    $groupAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class(['soa-radio-group'])
        ->merge(['role' => 'radiogroup']);
@endphp
<div {!! $groupAttributes !!}>{!! $content ?? '' !!}</div>
