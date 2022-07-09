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
        @if($max_depth > 1)
            <menu id="nestable-menu" class="no-gutters p-3">
                <button type="button" data-action="expand-all"
                        class="btn btn-primary btn-sm">@lang('sleeping_owl::lang.tree.expand')</button>
                <button type="button" data-action="collapse-all"
                        class="btn btn-secondary btn-sm">@lang('sleeping_owl::lang.tree.collapse')</button>
            </menu>
        @endif
        <div class="card-body mt-3 p-0 b-0">
            <div class="dd nestable pb-3" {!! $attributes !!} data-url="{{ $url }}/reorder" data-parameters="{{ json_encode($parameters) }}">
                <ol class="dd-list">
                    @include(AdminTemplate::getViewPath('display.tree_children'), ['children' => $items])
                </ol>
            </div>
        </div>
        @yield('card.footer')
        @yield('panel.footer')
    </div>

</div>
@yield('after.card')
@yield('after.panel')
