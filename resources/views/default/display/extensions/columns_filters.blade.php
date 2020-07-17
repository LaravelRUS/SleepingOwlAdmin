<div {!! $attributes !!}>
    @foreach ($filters as $index => $filter)
        @if ($filter)
            <div data-index="{{ $index }}">
                {!! $filter !!}
            </div>
        @endif
    @endforeach
</div>
