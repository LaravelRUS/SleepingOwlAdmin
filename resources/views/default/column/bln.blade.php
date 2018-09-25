<div {!! $attributes !!}>
  <div class="text-center">
    {!! $value ? '<i class="fa fa-check"></i>' : '<i class="fa fa-minus"></i>' !!} {!! $append !!}
  </div>
  @if($small)
  <small class="clearfix">{!! $small !!}</small>
  @endif
</div>
