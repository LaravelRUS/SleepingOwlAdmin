<div {!! $attributes !!}>
  @if ($visibled)
    <div class="text-center">
      {!! $value ? '<i class="fas fa-check"></i>' : '<i class="fas fa-minus"></i>' !!}
      {!! $append !!}
    </div>

    @if($small)
      <small class="clearfix">{!! $small !!}</small>
    @endif
  @endif
</div>
