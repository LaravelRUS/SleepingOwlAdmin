@if($isEditable)
<a href="{{ $link }}" {{ app('html')->attributes($linkAttributes) }}>
    {!! $value !!}
</a>
@else
    {!! $value !!}
@endif
{!! $append !!}