@php
    $labelAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class(['soa-label']);
@endphp
<label {!! $labelAttributes !!}>{{ $text ?? '' }}@if(!empty($required))<span class="soa-required" aria-hidden="true">*</span>@endif</label>
