@if(count($errors->get($path = str_replace([']', '['], ['', '.'], $name)))> 0)
    <ul class="form-element-errors soa-field-errors">
        @foreach ($errors->get($path) as $error)
            <li>{!! $error !!}</li>
        @endforeach
    </ul>
@endif
