@php
    $progressAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class(['soa-progress'])
        ->merge(['max' => $max ?? 100, 'value' => $value ?? 0]);
@endphp
<progress {!! $progressAttributes !!}>{{ $value ?? 0 }}</progress>
