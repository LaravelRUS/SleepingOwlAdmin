<div class="panel panel-default">
    <div class="panel-heading">
        @if ($creatable)
            <a class="btn btn-primary" href="{{ $createUrl }}">
                <i class="fa fa-plus"></i> @lang('sleeping_owl::lang.table.new-entry')
            </a>
        @endif
    </div>

    <menu id="nestable-menu" class="panel-heading no-margin" >
        <button type="button" data-action="expand-all" class="btn btn-sm">@lang('sleeping_owl::lang.tree.expand')</button>
        <button type="button" data-action="collapse-all" class="btn btn-sm">@lang('sleeping_owl::lang.tree.collapse')</button>
    </menu>

    <div class="panel-body">
        <div class="dd nestable" data-url="{{ $url }}/reorder">
            <ol class="dd-list">
                @include(AdminTemplate::getViewPath('display.tree_children'), ['children' => $items])
            </ol>
        </div>
    </div>
</div>

