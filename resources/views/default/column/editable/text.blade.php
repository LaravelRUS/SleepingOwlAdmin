<div {!! $attributes !!}>
  <a href="#"
      class="inline-editable"
      data-name="{{ $name }}"
      data-value="{{ $value }}"
      data-url="{{ $url }}"
      data-type="text"
      data-pk="{{ $id }}"
      data-mode="{{ $mode }}"
      data-disabled="{{ !$isEditable }}"
  >{{ $text }}</a>

  {!! $append !!}

  @if($small)
    <small class="clearfix">{!! $small !!}</small>
  @endif
</div>
