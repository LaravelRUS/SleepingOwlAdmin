@if($items instanceof \SleepingOwl\Admin\Form\Element\Columns)
    <div class="form-elements w-100 soa-form-elements">
        {!! $items->render() !!}
    </div>
@else
    <div class="form-elements w-100 soa-form-elements">
        @foreach ($items as $item)
            @if($item instanceof \Illuminate\Contracts\Support\Renderable)
                @if(method_exists($item, 'getName'))
                    @yield('before.'. $item->getName())
                @endif
                {!! $item->render() !!}
                @if(method_exists($item, 'getName'))
                    @yield('after.'. $item->getName())
                @endif
            @else
                {!! $item !!}
            @endif
        @endforeach
    </div>
@endif
