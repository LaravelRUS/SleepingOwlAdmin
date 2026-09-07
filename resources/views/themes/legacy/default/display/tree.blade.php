@yield('before.card')
@yield('before.panel')

<div class="card card-default {!! $card_class !!}">
    <div class="card-heading card-header">
        @if ($creatable)
            <a class="btn btn-primary mt-2" href="{{ $createUrl }}">
                <i class="fas fa-plus"></i> {{ $newEntryButtonText }}
            </a>
        @endif

        <div class="pull-right">
            @yield('card.heading.actions')
            @yield('panel.heading.actions')

            @yield('card.buttons')
            @yield('panel.buttons')
        </div>
    </div>

    <div class="card-heading card-header">
        @yield('card.heading')
        @yield('panel.heading')
    </div>

    <div class="card-body p-0 b-0">
        @php
            $treeParametersId = 'soa-tree-parameters-'.\Illuminate\Support\Str::uuid();
            $treeAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
                ->except(['data-url', 'data-parameters'])
                ->class(['soa-tree', 'pb-3']);
        @endphp
        <div {!! $treeAttributes !!}
             data-tree
             data-tree-parameters-id="{{ $treeParametersId }}"
             data-url="{{ $url }}/reorder"
             data-reorderable="{{ $reorderable ? 'true' : 'false' }}">
            @if($max_depth > 1)
                <menu class="soa-tree-menu no-gutters p-3">
                    <button type="button" data-tree-action="expand-all"
                            class="btn btn-primary btn-sm">@lang('sleeping_owl::lang.tree.expand')</button>
                    <button type="button" data-tree-action="collapse-all"
                            class="btn btn-secondary btn-sm">@lang('sleeping_owl::lang.tree.collapse')</button>
                </menu>
            @endif
            <ol class="soa-tree-list" data-tree-list data-tree-root>
                @include(AdminTemplate::getViewPath('display.tree_children'), [
                    'children' => $items,
                    'depth' => 1,
                ])
            </ol>
            <script id="{{ $treeParametersId }}" type="application/json">{!! \Illuminate\Support\Js::encode($parameters) !!}</script>
        </div>
        @yield('card.footer')
        @yield('panel.footer')
    </div>

</div>
@yield('after.card')
@yield('after.panel')
