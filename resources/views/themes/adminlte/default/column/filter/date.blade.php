@if ($visibled)
<div class="input-group input-date date" {!! $width !!}>
    @php
        $filterAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
            ->merge(['data-date-format' => $pickerFormat, 'type' => 'text'])
            ->class(['form-control', 'column-filter']);
    @endphp
    <input {!! $filterAttributes !!} />

    <span class="input-group-text">
        <span class="far fa-calendar-alt"></span>
    </span>
</div>
@if(!empty($helpText))
    <small class="form-text text-muted">{!! $helpText !!}</small>
@endif
@endif
