@yield('before.card')
@yield('before.panel')

<div class="dd nestable" id="nestable3">
    <ol class="dd-list">
        <li class="dd-item dd3-item" data-id="13">
            <div class="dd-handle dd3-handle">Drag</div>
            <div class="dd3-content">Item 13</div>
        </li>
        <li class="dd-item dd3-item" data-id="14">
            <div class="dd-handle dd3-handle">Drag</div>
            <div class="dd3-content">Item 14</div>
        </li>
        <li class="dd-item dd3-item" data-id="15">
            <div class="dd-handle dd3-handle">Drag</div>
            <div class="dd3-content">Item 15</div>
            <ol class="dd-list">
                <li class="dd-item dd3-item" data-id="16">
                    <div class="dd-handle dd3-handle">Drag</div>
                    <div class="dd3-content">Item 16</div>
                </li>
                <li class="dd-item dd3-item" data-id="17">
                    <div class="dd-handle dd3-handle">Drag</div>
                    <div class="dd3-content">Item 17</div>
                </li>
                <li class="dd-item dd3-item" data-id="18">
                    <div class="dd-handle dd3-handle">Drag</div>
                    <div class="dd3-content">Item 18</div>
                </li>
            </ol>
        </li>
    </ol>
</div>


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
            <div class="dd nestable" {!! $attributes !!} data-url="{{ $url }}/reorder">
                <ol class="dd-list {{ $collapsed ? ' dd-collapsed' : '' }}">
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
