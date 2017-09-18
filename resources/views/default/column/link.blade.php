@if($isEditable)
<a href="{{ $link }}" {{ app('html')->attributes($linkAttributes) }}>
    {!! $value !!}
</a>
@else
    {!! $value !!}
@endif
{!! $append !!}
@if($small)
  <p>
    <small>{!! $small !!}</small>
  </p>
@endif
