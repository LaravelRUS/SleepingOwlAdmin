@if($isEditable)
    <a href="#"
       {!! $attributes !!}
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
    {{ $text }}
@endif

{!! $append !!}
