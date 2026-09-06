<div {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []) !!}>
  @if ($visibled)
    @if (!empty($value))
      {!! HTML::mailto($value, $value) !!}
    @endif
    {!! $append !!}

    @if($small)
      <small class="clearfix">{!! $small !!}</small>
    @endif
  @endif
</div>
