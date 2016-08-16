@if(count($actions) > 0)
<form {!! $attributes !!}>
    {{ csrf_field() }}

    @foreach ($actions as $action)
        {!! $action->render() !!}
    @endforeach
</form>
@endif