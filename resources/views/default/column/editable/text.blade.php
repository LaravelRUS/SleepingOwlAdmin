<div {!! $attributes !!}>
  @if ($visibled)
    @if($isEditable)
      <a href="#"
          class="inline-editable"
          data-name="{{ $name }}"
          data-value="{{ $value }}"
          data-url="{{ $url }}"
          data-type="text"
          data-pk="{{ $id }}"
          data-mode="{{ $mode }}"
          data-emptytext="{{ trans('sleeping_owl::lang.select.no_items') }}"
          data-disabled="{{ !$isEditable }}"
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
