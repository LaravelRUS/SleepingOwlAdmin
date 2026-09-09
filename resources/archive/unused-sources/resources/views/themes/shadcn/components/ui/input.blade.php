@php
    $inputAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class(['soa-input'])
        ->merge(['type' => $type ?? 'text']);
@endphp
<input {!! $inputAttributes !!}>
