<a  href="#"
    class="inline-editable"
    data-name="{{ $name }}"
    data-value="{{ $key }}"
    data-url="{{ $url }}"
    data-type="select"
    data-pk="{{ $id }}"
    data-title="{{ $headerTitle }}"
    data-source="{{ json_encode($options) }}"
>{{ $value }}</a>


{!! $append !!}
