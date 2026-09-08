@php
    $spinnerAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class(['soa-spinner'])
        ->merge(['aria-label' => $label ?? trans('sleeping_owl::lang.table.loadingRecords'), 'role' => 'status']);
@endphp
<span {!! $spinnerAttributes !!}></span>
