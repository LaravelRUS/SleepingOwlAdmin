@foreach ($children as $entry)

    <li class="dd-item dd3-item{{ $reorderable ? '' : ' dd3-not-reorderable' }}{{ (isset($entry->level) && $entry->level >= $collapsedLevel) || $collapsedLevel == 0 ? ' dd-collapsed' : '' }}"
        data-id="{{ $entry->id }}">
        @if ($reorderable)
            <div class="dd-handle dd3-handle" @if (!is_callable($value)) title="{{ $entry->{$value} }}" @endif></div>
        @endif
        <div class="dd3-content">

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

        @if ($entry->children && $entry->children->count() > 0)
            <ol class="dd-list">
                @include(AdminTemplate::getViewPath('display.tree_children'), ['children' => $entry->children])
            </ol>
        @endif
    </li>
@endforeach
