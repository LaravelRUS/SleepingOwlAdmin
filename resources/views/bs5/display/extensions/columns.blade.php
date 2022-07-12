{{-- Only tables --}}
<div class="card-body pt-0 px-0">

    @yield('table.top.header')

    <table {!! $attributes !!}>
        <colgroup>
            @foreach ($columns as $column)
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

        <tbody>
            @foreach ($collection as $model)
                <tr>
                    @foreach ($columns as $column)
                        @php
                            $column->setModel($model);

                            if ($column instanceof \SleepingOwl\Admin\Display\Column\Control) {
                                $column->initialize();
                            }
                        @endphp

                        <td v-pre>
                            {!! $column->render() !!}
                        </td>

                    @endforeach
                </tr>
            @endforeach
        </tbody>

        @yield('table.footer')
    </table>

</div>

@if(isset($pagination) && $pagination)
    <div class="card-footer">
        {!! $pagination !!}
    </div>
@endif
