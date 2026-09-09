@if ($visibled)
<div class="input-group input-date date soa-input-group" {!! $width !!}>
    @php
        $filterAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
            ->merge(['data-date-format' => $pickerFormat, 'type' => 'text'])
            ->class(['form-control', 'column-filter', 'soa-input']);
    @endphp
    <input {!! $filterAttributes !!} />

    <span class="input-group-text soa-input-addon">
        <span class="far fa-calendar-alt"></span>
    </span>
</div>
@if(!empty($helpText))
    <small class="form-text text-muted soa-help-text">{!! $helpText !!}</small>
@endif
@endif
