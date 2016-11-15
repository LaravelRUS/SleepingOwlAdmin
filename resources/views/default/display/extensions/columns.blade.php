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
                <?php
                $column->setModel($model);
                if($column instanceof \SleepingOwl\Admin\Display\Column\Control) {
                    $column->initialize();
                }
                ?>

                <td {!! $column->htmlAttributesToString() !!}>
                    {!! $column->render() !!}
                </td>
            @endforeach
        </tr>
    @endforeach
    </tbody>

    @yield('table.footer')
</table>

@if(!is_null($pagination))
    <div class="panel-footer">
        {!! $pagination !!}
    </div>
@endif