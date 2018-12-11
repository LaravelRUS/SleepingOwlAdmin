@yield('before.panel')

<div class="panel panel-default {!! $panel_class !!}">
    <div class="panel-heading">
        @if ($creatable)
            <a class="btn btn-primary" href="{{ $createUrl }}">
                <i class="fa fa-plus"></i> {{ $newEntryButtonText }}
            </a>
        @endif
        @yield('panel.buttons')
        <div class="pull-right">
            @yield('panel.heading.actions')
        </div>
    </div>
    @yield('panel.heading')
    @if($max_depth > 1)
        <menu id="nestable-menu" class="panel-heading no-margin">
            <button type="button" data-action="expand-all"
                    class="btn btn-sm">@lang('sleeping_owl::lang.tree.expand')</button>
            <button type="button" data-action="collapse-all"
                    class="btn btn-sm">@lang('sleeping_owl::lang.tree.collapse')</button>
        </menu>
    @endif
    <div class="panel-body">
        <div class="dd nestable" {!! $attributes !!} data-url="{{ $url }}/reorder">
            <ol class="dd-list">
                @include(AdminTemplate::getViewPath('display.tree_children'), ['children' => $items])
            </ol>
        </div>
    </div>
    @yield('panel.footer')
</div>
@yield('after.panel')
