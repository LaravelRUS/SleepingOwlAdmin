<a href="#"
    {!! $attributes !!}
    data-name="{{ $name }}"
    data-value="{{ $value }}"
    data-url="{{ $url }}"
    data-type="text"
    data-pk="{{ $id }}"
    data-mode="{{ $mode }}"
    data-disabled="{{ !$isEditable }}"
>{{ $text }}</a>

{!! $append !!}
