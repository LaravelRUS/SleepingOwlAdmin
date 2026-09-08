@php
    $paginationAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class(['soa-pagination']);
@endphp
<nav {!! $paginationAttributes !!} aria-label="{{ $label ?? trans('sleeping_owl::lang.table.page_jump.label') }}">
    {!! $content ?? '' !!}
</nav>
