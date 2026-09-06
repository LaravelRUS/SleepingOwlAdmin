<{{ $tag }} {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray) !!}>
    <tr>
        @foreach ($filters as $index => $filter)
            <td data-index="{{ $index }}">
                {!! $filter !!}
            </td>
        @endforeach
    </tr>
</{{ $tag }}>
