<a href="#"
    {!! $attributes !!}
    data-name="{{ $name }}"
    data-value="{{ $value }}"
    data-url="{{ $url }}"
    data-type="{{ $type }}"
    data-format = "{{ $format }}"
    data-viewformat = "dd/mm/yyyy"
    data-mode="{{ $mode }}"
    data-pk="{{ $id }}"
>{{ $value }}</a>

{!! $append !!}
