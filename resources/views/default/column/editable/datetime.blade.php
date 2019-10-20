<div {!! $attributes !!}>
  <a href="#"
      class="inline-editable"
      data-inputclass="datatime-editable"
      data-name="{{ $name }}"
      data-value="{{ $value }}"
      data-url="{{ $url }}"
      data-type="{{ $type }}"
      data-format = "{{ $format }}"
      data-viewformat = "{{ $viewformat }}"
      data-mode="{{ $mode }}"
      data-combodate="{{ $combodateValue  }}"
      data-pk="{{ $id }}"
      data-disabled="{{ !$isEditable }}"
  >{{ $text }}</a>

  {!! $append !!}

  @if($small)
    <small class="clearfix">{!! $small !!}</small>
  @endif
</div>
