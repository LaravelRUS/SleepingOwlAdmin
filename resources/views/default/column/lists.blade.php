<div {!! $attributes !!}>
  @foreach ($values as $value)
    <span class="badge table-badge" v-pre>{!! $value !!}</span>
  @endforeach
  {!! $append !!}

  @if($small)
    <small class="clearfix">{!! $small !!}</small>
  @endif
</div>
