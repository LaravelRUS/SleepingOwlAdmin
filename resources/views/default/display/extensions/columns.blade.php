<table {!! HTML::attributes($attributes) !!}>
    <colgroup>
        @foreach ($columns as $column)
            <col width="{!! $column->getWidth() !!}" />
        @endforeach
    </colgroup>
    <thead>
    <tr>
        @foreach ($columns as $column)
            {!! $column->getHeader()->render() !!}
        @endforeach
    </tr>
    </thead>
    <tbody>
    @foreach ($collection as $model)
        <tr>
            @foreach ($columns as $column)
                <?php $column->setModel($model); ?>
                {!! $column->render() !!}
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