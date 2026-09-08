@yield('before.card')
@yield('before.panel')

<div class="card soa-card {!! $card_class !!}">
    <div class="card-header soa-card-header">
        @if ($creatable)
            <a class="btn btn-primary mt-2 soa-button soa-button-primary" href="{{ $createUrl }}">
                <i class="fas fa-plus"></i> {{ $newEntryButtonText }}
            </a>
        @endif

        <div class="float-end soa-toolbar">
            @yield('card.heading.actions')
            @yield('panel.heading.actions')

            @yield('card.buttons')
            @yield('panel.buttons')
        </div>
    </div>

    <div class="card-header soa-card-header">
        @yield('card.heading')
        @yield('panel.heading')
    </div>

    <div class="card-body p-0 b-0 soa-card-body soa-card-body-flush">
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
            <div class="soa-tree-notification" data-tree-notification role="status" aria-live="polite" aria-atomic="true" hidden></div>
            @if($max_depth > 1)
                <menu class="soa-tree-menu g-0 p-3 soa-toolbar">
                    <button type="button" data-tree-action="expand-all"
                            class="btn btn-primary btn-sm soa-button soa-button-sm soa-button-primary">@lang('sleeping_owl::lang.tree.expand')</button>
                    <button type="button" data-tree-action="collapse-all"
                            class="btn btn-secondary btn-sm soa-button soa-button-sm soa-button-secondary">@lang('sleeping_owl::lang.tree.collapse')</button>
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
