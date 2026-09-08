@php
    $checkboxAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class(['soa-checkbox'])
        ->merge(['type' => 'checkbox']);
@endphp
<span class="soa-checkbox-field">
    <input {!! $checkboxAttributes !!}>
    @if(isset($label))
        <label class="soa-checkbox-label" @if($checkboxAttributes->has('id')) for="{{ $checkboxAttributes->get('id') }}" @endif>{!! $label !!}</label>
    @endif
</span>
