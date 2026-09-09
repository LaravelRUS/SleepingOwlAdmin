<div class="panel-table card-body pt-0 ps-0 pe-0 soa-table-region">

    @php
        $tableAttributes = new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []);
        $tableAttributes = $tableAttributes->class(array_merge(['table', 'soa-table'], $themeClasses ?? []));
    @endphp
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
@if(!is_null($pagination))
    <div class="card-footer soa-card-footer">
        <nav class="soa-pagination" aria-label="{{ trans('sleeping_owl::lang.table.page_jump.label') }}">
            {!! $pagination !!}
        </nav>
    </div>
@endif
