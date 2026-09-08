@php
    $tableAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class(['table', 'soa-table']);
@endphp
<div class="soa-table-region">
    <table {!! $tableAttributes !!}>
        @if(!empty($caption))<caption>{{ $caption }}</caption>@endif
        {!! $content ?? '' !!}
    </table>
</div>
