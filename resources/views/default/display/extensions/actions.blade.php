<form {!! HTML::attributes($attributes) !!}>
    <input type="hidden" name="_ids[]" />
    @foreach ($actions as $action)
        {!! $action->render() !!}
    @endforeach
</form>