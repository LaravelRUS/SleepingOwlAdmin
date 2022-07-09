<div {!! $attributes !!}>
  @if ($visibled)
    @if (!empty($value))
      <a href="{{ $value }}" data-toggle="lightbox">
        <img class="thumbnail" src="{{ $value }}">
      </a>
    @endif
    {!! $append !!}

    @if($small)
      <small class="clearfix">{!! $small !!}</small>
    @endif
  @endif
</div>
