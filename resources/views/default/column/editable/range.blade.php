<div {!! $attributes !!}>
  @if ($visibled)
    @if(!$isReadonly)
      <a href="#"
          class="inline-editable"
          data-name="{{ $name }}"
          data-value="{{ $value }}"
          data-url="{{ $url }}"
          data-type="range"
          @if (isset($min))
            data-min="{{ $min }}"
          @endif
          @if (isset($max))
            data-max="{{ $max }}"
          @endif
          @if (isset($step))
            data-step="{{ $step }}"
          @endif
          data-tpl="<input type='range'><output class='d-block form-group mt-3'></output>"
          data-pk="{{ $id }}"
          data-mode="{{ $mode }}"
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
