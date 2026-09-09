<div {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []) !!}>
  @if ($visibled)
    @if($escapeValue ?? false)
      {{ $value }}
    @else
      {!! $value !!}
    @endif
    {!! $append !!}

    @if($small)
      <small class="clearfix">{!! $small !!}</small>
    @endif
  @endif
</div>
