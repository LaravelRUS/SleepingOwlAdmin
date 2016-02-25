<form action="{{ $action }}" method="POST" class="panel panel-default">

    <input type="hidden" name="_token" value="{{ csrf_token() }}" />

    @foreach($items as $panelTitle => $formItems)

    @if(!is_integer($panelTitle))
    <div class="panel-heading">
        <span class="panel-title">{{ $panelTitle }}</span>
    </div>
    @endif

    <div class="panel-body">
        @if($formItems instanceof \SleepingOwl\Admin\Form\Element\Columns)
            {!! $formItems->render() !!}
        @else
        @foreach ($formItems as $item)
            {!! $item->render() !!}
        @endforeach
        @endif
    </div>

    @endforeach

    {!! $buttons->render() !!}
</form>
