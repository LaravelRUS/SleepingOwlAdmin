<div {!! $attributes !!}>
  @if ($visibled)
    @if($isEditable)
      <a href="{{ $link }}" {!! app('html')->attributes($linkAttributes) !!}>
        {!! $value !!}
      </a>
    @else
      {!! $value !!}
    @endif
    {!! $append !!}

    @if($small)
      <small class="clearfix">{!! $small !!}</small>
    @endif
  @endif
</div>
