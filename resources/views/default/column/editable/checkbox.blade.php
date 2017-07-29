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
    ></a>

@else
    @if($value) {{ $checkedLabel }} @else {{ $uncheckedLabel }} @endif
@endif

{!! $append !!}
