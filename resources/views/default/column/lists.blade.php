<div {!! $attributes !!}>
  @foreach ($values as $value)
    <span class="badge table-badge">{{ $value }}</span>
  @endforeach
  {!! $append !!}

  @if($small)
    <small class="clearfix">{!! $small !!}</small>
  @endif
</div>
