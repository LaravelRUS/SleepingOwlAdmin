@if($items instanceof \SleepingOwl\Admin\Form\Element\Columns)
    <div class="form-elements">
        {!! $items->render() !!}
    </div>
@else
    <div class="form-elements">
        @foreach ($items as $item)
            @if($item instanceof \Illuminate\Contracts\Support\Renderable)
                {!! $item->render() !!}
            @else
                {!! $item !!}
            @endif
        @endforeach
    </div>
@endif