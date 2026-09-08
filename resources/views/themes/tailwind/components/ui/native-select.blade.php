@php
    $selectAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class(['soa-select']);
@endphp
<select {!! $selectAttributes !!}>{!! $content ?? '' !!}</select>
