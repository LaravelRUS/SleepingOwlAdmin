<div {!! $attributes !!}>
  @if ($visibled)
    @if (!empty($value))
            <a href="mailto:{{ e($value) }}">{{ e($value) }}</a>
    @endif
    {!! $append !!}

    @if($small)
      <small class="clearfix">{!! $small !!}</small>
    @endif
  @endif
</div>
