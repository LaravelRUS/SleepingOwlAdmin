@if($isEditable)
<a href="#"
       class="inline-editable"
       data-name="{{ $name }}"
       data-value="{{ $value }}"
       data-url="{{ request()->url() }}"
       data-type="checklist"
       data-pk="{{ $id }}"
       data-source="{ 1 : '{{ $checkedLabel }}' }"
       data-emptytext="{{ $uncheckedLabel }}"
></a>

@else
    @if($value) {{ $checkedLabel }} @else {{ $uncheckedLabel }} @endif
@endif