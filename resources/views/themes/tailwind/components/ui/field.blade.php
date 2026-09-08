@php
    $fieldAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class(['soa-field', 'has-error' => !empty($error)]);
@endphp
<div {!! $fieldAttributes !!}>
    @if(isset($label))
        <label class="soa-label" @if(!empty($for)) for="{{ $for }}" @endif>
            {!! $label !!}@if(!empty($required))<span class="soa-required" aria-hidden="true">*</span>@endif
        </label>
    @endif
    @if(isset($help))<div class="soa-help">{!! $help !!}</div>@endif
    {!! $content ?? '' !!}
    @if(!empty($error))<div class="soa-field-error" role="alert">{!! $error !!}</div>@endif
</div>
