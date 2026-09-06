<{{ $tag }} {!! new \Illuminate\View\ComponentAttributeBag($attributesArray) !!}>
    <tr>
        @foreach ($filters as $index => $filter)
            <td data-index="{{ $index }}">
                {!! $filter !!}
            </td>
        @endforeach
    </tr>
</{{ $tag }}>
