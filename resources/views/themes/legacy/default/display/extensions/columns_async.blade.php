<div class="panel-table card-body pt-0 ps-0 pe-0">

    @php($tableAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['table']))
    <table {!! $tableAttributes !!}>
        <colgroup>
            @foreach ($columns as $column)
                <col width="{!! $column->getWidth() !!}"/>
            @endforeach
        </colgroup>

        <thead>
        <tr>
            @foreach ($columns as $column)
                <th {!! (new \SleepingOwl\Admin\Support\HtmlAttributeBag($column->getHeader()->getHtmlAttributes()))->class([$column->getHtmlAttribute('class')]) !!}>
                    {!! $column->getHeader()->render() !!}
                </th>
            @endforeach
        </tr>
        </thead>

        @yield('table.header')
        <tbody></tbody>
        @yield('table.footer')
    </table>

</div>
