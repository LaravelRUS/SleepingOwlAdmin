@if(count($actions) > 0)
    <div {!! $attributes !!}>
        @foreach($actions as $action)
            {!! $action->render() !!}
        @endforeach
    </div>
    <div class="clearfix"></div>
@endif
