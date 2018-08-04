<table {!! $attributes !!}>
    <colgroup>
        @foreach ($columns as $column)
            @continue(!$column->isVisible())
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
    @yield('table.header')
    @yield('table.footer')
</table>

