<div {!! $attributes !!}>
  @if ($visibled)
    @if($isEditable)
      {!! app('A')->attributes($linkAttributes)->href($link)->text($value) !!}
    @else
      {!! $value !!}
    @endif
    {!! $append !!}

    @if($small)
      <small class="clearfix">{!! $small !!}</small>
    @endif
  @endif
</div>
