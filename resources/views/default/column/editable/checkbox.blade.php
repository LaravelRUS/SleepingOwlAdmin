<div {!! $attributes !!}>
  @if ($visibled)
    @if($isEditable)
        <a href="#"
           class="inline-editable"
           data-mode="{{ $mode }}"
           data-name="{{ $name }}"
           data-value="{{ $value }}"
           data-url="{{ $url }}"
           data-type="checklist"
           data-pk="{{ $id }}"
           data-source="{ 1 : '{{ $checkedLabel }}' }"
           data-emptytext="{{ $uncheckedLabel }}"
           data-disabled="{{ !$isEditable }}"
        ></a>
    @else
        <span v-pre>
            {!! $text !!}
        </span>
    @endif

    {!! $append !!}

    @if($small)
      <small class="clearfix">{!! $small !!}</small>
    @endif
  @endif
</div>
