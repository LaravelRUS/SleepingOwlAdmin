@if(!$group->isEmpty())
    <div class='grouped-element' data-index='@isset($index){{ $index + 1 }}@endisset'
         @if($group->getModel())data-pk='{{ $group->getPrimary() }}'@endif>
        <div class='grouped-element__head'>
            @if($group->getLabel() && isset($index))
                <span><b>{{ $group->getLabel() }} {{ $index + 1 }}</b></span>
            @endif
        </div>
        <div class='grouped-element__body'>
            @foreach ($group as $item)
                @if($item instanceof \Illuminate\Contracts\Support\Renderable)
                    {!! $item->render() !!}
                @else
                    {!! $item !!}
                @endif
            @endforeach
        </div>
        <div class='form-group clearfix'>
            <button type='button'
                    data-original-text='{!! trans('sleeping_owl::lang.related.remove') !!}'
                    data-toggle='tooltip'
                    class='btn btn-warning pull-right btn-sm grouped-element__delete related-action_remove'>
                <i class='icon icon-trash'></i>
                {!! trans('sleeping_owl::lang.related.remove') !!}
            </button>
        </div>
        <hr>
    </div>
@endif
