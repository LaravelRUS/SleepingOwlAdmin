<div {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []) !!}>
  @if ($visibled)
    @if($isEditable)
      <a {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag(array_merge($linkAttributes, ['href' => $link])) !!}>{{ $value }}</a>
    @else
      {!! $value !!}
    @endif
    {!! $append !!}

    @if($small)
      <small class="clearfix">{!! $small !!}</small>
    @endif
  @endif
</div>
