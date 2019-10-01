@if(count($action_form) > 0)
    <div {!! $attributes !!}>
        @foreach($action_form as $action_form_element)
            {!! $action_form_element->render() !!}
        @endforeach
    </div>
@endif
