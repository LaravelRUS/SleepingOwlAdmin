<a  href="#"
    {!! $attributes !!}
    data-mode="{{ $mode }}"
    data-name="{{ $name }}"
    data-value="{{ $value }}"
    data-url="{{ $url }}"
    data-type="select"
    data-pk="{{ $id }}"
    data-title="{{ $title }}"
    data-source="{{ json_encode($options) }}"
>{{ $optionName }}</a>

{!! $append !!}
