<div {!! $attributes !!}>

    @php
        $attrs = '';
        foreach ($linkAttributes as $attr => $val) {
            if (is_bool($val)) {
                if ($val) $attrs .= ' ' . $attr;
            } else {
                $attrs .= ' ' . $attr . '="' . e($val) . '"';
            }
        }
    @endphp

  @if ($visibled)
    @if($isEditable)
      <a href="{{ $link }}" {!! $attrs !!}>
        {!! $value !!}
      </a>
    @else
      {!! $value !!}
    @endif
    {!! $append !!}

    @if($small)
      <small class="clearfix">{!! $small !!}</small>
    @endif
  @endif
</div>
