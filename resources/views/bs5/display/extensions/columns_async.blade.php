<div class="panel-table card-body pt-0 pl-0 pr-0">

    <table {!! $attributes !!}>
        <colgroup>
            @foreach ($columns as $column)
                @continue(!$column->isVisible())
                <col width="{!! $column->getWidth() !!}"/>
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

        @yield('table.header')
        <tbody></tbody>
        @yield('table.footer')
    </table>

</div>
