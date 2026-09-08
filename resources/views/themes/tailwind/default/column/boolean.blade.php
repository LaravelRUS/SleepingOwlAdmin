<div {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []) !!}>
  @if ($visibled)
    <div class="text-center soa-column-center">
      {!! $value ? '<i class="fas fa-check"></i>' : '<i class="fas fa-minus"></i>' !!}
      {!! $append !!}
    </div>

    @if($small)
      <small class="clearfix">{!! $small !!}</small>
    @endif
  @endif
</div>
