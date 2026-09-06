@foreach ($children as $entry)
    @php
        $hasChildren = $entry->children && $entry->children->count() > 0;
        $collapsed = (isset($entry->level) && $entry->level >= $collapsedLevel) || $collapsedLevel == 0;
    @endphp
    <li class="soa-tree-item{{ $reorderable ? '' : ' soa-tree-item-static' }}"
        data-soa-tree-item
        data-soa-tree-collapsed="{{ $hasChildren && $collapsed ? 'true' : 'false' }}"
        data-id="{{ $entry->id }}">
        @if ($reorderable)
            <button type="button"
                    class="soa-tree-handle"
                    data-soa-tree-handle
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
            <ol class="soa-tree-list" data-soa-tree-list @if($hasChildren && $collapsed) hidden @endif>
                @include(AdminTemplate::getViewPath('display.tree_children'), [
                    'children' => $entry->children ?? collect(),
                    'depth' => $depth + 1,
                ])
            </ol>
        @endif
    </li>
@endforeach
