@php
    $switchAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class(['soa-switch-control'])
        ->merge(['role' => 'switch', 'type' => 'checkbox']);
@endphp
<label class="soa-switch">
    <input {!! $switchAttributes !!}>
    <span class="soa-switch-track" aria-hidden="true"><span class="soa-switch-thumb"></span></span>
    @if(isset($label))<span class="soa-switch-label">{!! $label !!}</span>@endif
</label>
