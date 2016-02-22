<tr>
    @foreach ($columns as $index => $column)
        <?php $columnFilter = array_get($columnFilters, $index); ?>
        <td data-index="{{ $index }}">{!! $columnFilter !!}</td>
    @endforeach
</tr>
