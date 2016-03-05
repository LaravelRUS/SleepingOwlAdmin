<script type="text/javascript">
    $(function () {
        $('.nestable').nestable({
            maxDepth: 20
        }).on('change', function (e) {
            var url = $(this).data('url');
            var list = e.length ? e : $(e.target);
            var data = list.nestable('serialize');
            $.post(url, {data: data});
        });
    })
</script>

<div class="panel panel-default">
    <div class="panel-heading">
        @if ($creatable)
            <a class="btn btn-primary" href="{{ $createUrl }}">
                <i class="fa fa-plus"></i> {{ trans('sleeping_owl::lang.table.new-entry') }}
            </a>
        @endif
    </div>

    <div class="panel-body">
        <div class="dd nestable" data-url="{{ $url }}/reorder">
            <ol class="dd-list">
                @include(AdminTemplate::getViewPath('display.tree_children'), ['children' => $items])
            </ol>
        </div>
    </div>
</div>

