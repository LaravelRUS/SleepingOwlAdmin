<div {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []) !!}>
  @if ($visibled)
    @if (!empty($value))
      <a href="{{ $value }}" data-lightbox>
        <img class="thumbnail" src="{{ $value }}">
      </a>
    @endif
    {!! $append !!}

    @if($small)
      <small class="clearfix">{!! $small !!}</small>
    @endif
  @endif
</div>
