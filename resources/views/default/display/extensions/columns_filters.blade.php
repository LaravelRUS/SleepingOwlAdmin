<table {!! $attributes !!}>
    <thead>
    <tr>
        @foreach ($filters as $index => $filter)
        <td data-index="{{ $index }}">
            {!! $filter !!}
        </td>
        @endforeach
    </tr>
    </thead>
</table>