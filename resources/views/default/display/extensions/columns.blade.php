<table {!! $attributes !!}>
    <colgroup>
        @foreach ($columns as $column)
            <col width="{!! $column->getWidth() !!}" />
        @endforeach
    </colgroup>
    <thead>
    <tr>
        @foreach ($columns as $column)
            <th {!! $column->getHeader()->htmlAttributesToString() !!}>
                {!! $column->getHeader()->render() !!}
            </th>
        @endforeach
    </tr>
    </thead>
    <tbody>
    @foreach ($collection as $model)
        <tr>
            @foreach ($columns as $column)
                <?php $column->setModel($model); ?>
                <td {!! $column->htmlAttributesToString() !!}>
                    {!! $column->render() !!}
                </td>
            @endforeach
        </tr>
    @endforeach
    </tbody>

    @yield('table.footer')
</table>

@if($collection instanceof \Illuminate\Contracts\Pagination\Paginator)
    <div class="panel-footer">
        {!! $collection->render() !!}
    </div>
@endif