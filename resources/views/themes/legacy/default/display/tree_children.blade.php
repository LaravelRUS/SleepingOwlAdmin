@foreach ($children as $entry)
    @php
        $hasChildren = $entry->children && $entry->children->count() > 0;
        $collapsed = (isset($entry->level) && $entry->level >= $collapsedLevel) || $collapsedLevel == 0;
        $canHaveChildren = $hasChildren || $depth < $max_depth;
        $isCollapsed = $hasChildren && $collapsed;
        $isExpanded = $hasChildren && !$collapsed;
    @endphp
    <li class="soa-tree-item{{ $reorderable ? '' : ' soa-tree-item-static' }}"
        data-tree-item
        data-tree-collapsed="{{ $isCollapsed ? 'true' : 'false' }}"
        data-id="{{ $entry->id }}">
        @if ($canHaveChildren)
            <button type="button"
                    class="soa-tree-toggle"
                    data-tree-toggle
                    aria-expanded="{{ $isExpanded ? 'true' : 'false' }}"
                    aria-label="@lang($isCollapsed ? 'sleeping_owl::lang.tree.expand' : 'sleeping_owl::lang.tree.collapse')"
                    @if (!$hasChildren) hidden @endif>
                <span data-tree-toggle-expanded aria-hidden="true" @if ($isCollapsed) hidden @endif>−</span>
                <span data-tree-toggle-collapsed aria-hidden="true" @if (!$isCollapsed) hidden @endif>+</span>
            </button>
        @endif
        @if ($reorderable)
            <button type="button"
                    class="soa-tree-handle"
                    data-tree-handle
                    aria-label="@lang('sleeping_owl::lang.tree.move')"
                    @if (!is_callable($value)) title="{{ $entry->{$value} }}" @endif>≡</button>
        @endif
        <div class="soa-tree-content">

            @if (is_callable($value))
                {!! $value($entry) !!}
            @else
                {{ $entry->{$value} }}
            @endif

            <div class="control-button">
                @foreach ($controls as $control)
                    @php
                        if($control instanceof \SleepingOwl\Admin\Contracts\Display\ColumnInterface) {
                            $control->setModel($entry);
                            $control->initialize();
                        }
                    @endphp
                    {!! $control->render() !!}
                @endforeach
            </div>
        </div>

        @if ($hasChildren || $depth < $max_depth)
            <ol class="soa-tree-list" data-tree-list @if($hasChildren && $collapsed) hidden @endif>
                @include(AdminTemplate::getViewPath('display.tree_children'), [
                    'children' => $entry->children ?? collect(),
                    'depth' => $depth + 1,
                ])
            </ol>
        @endif
    </li>
@endforeach
