<div {!! $attributes !!}>
  @if ($visibled)
    {!! $value !!}
    {!! $append !!}

    @if($small)
      <small class="clearfix">{!! $small !!}</small>
    @endif
  @endif
</div>
