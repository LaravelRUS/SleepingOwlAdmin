<div {!! $attributes !!}>
  @if ($visibled)
    @if(!$isReadonly)
      <a href="#"
          class="dat-editable"
          data-inputclass="date-editable"
          data-name="{{ $name }}"
          data-value="{{ $value }}"
          data-url="{{ $url }}"
          data-type="{{ $type }}"
          data-format = "{{ $format }}"
          data-viewformat = "{{ $viewformat }}"
          data-mode="{{ $mode }}"
          data-combodate="{{ $combodateValue  }}"
          data-pk="{{ $id }}"
          data-emptytext="{{ trans('sleeping_owl::lang.select.empty') }}"
          {{ $isReadonly ? 'data-disabled' : '' }}
      >{{ $text }}</a>
    @else
        {!! $text !!}
    @endif

    {!! $append !!}

    @if($small)
      <small class="clearfix">{!! $small !!}</small>
    @endif
  @endif
</div>
