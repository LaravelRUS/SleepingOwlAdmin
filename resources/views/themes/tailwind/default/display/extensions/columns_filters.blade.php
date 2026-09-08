@php($filterAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['soa-filter-grid']))
<div {!! $filterAttributes !!}>
    @foreach ($filters as $index => $filter)
        @if ($filter)
            <div data-index="{{ $index }}" class="mb-2">
                {!! $filter !!}
            </div>
        @endif
    @endforeach
</div>
