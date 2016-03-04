<tfoot>
    <tr>
        @foreach ($filters as $index => $filter)
            <td>
                {!! $filter !!}
            </td>
        @endforeach
    </tr>
</tfoot>