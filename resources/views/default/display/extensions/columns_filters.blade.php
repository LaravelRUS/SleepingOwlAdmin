<tfoot {!! $attributes !!}>
    <tr>
        @foreach ($filters as $index => $filter)
            <td data-index="{{ $index }}">
                {!! $filter !!}
            </td>
        @endforeach
    </tr>
</tfoot>