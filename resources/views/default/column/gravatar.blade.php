@if ( ! empty($value))
    <a href="{{ $value }}" data-toggle="lightbox">
        <img class="thumbnail" src="{{ $value }}">
    </a>
@endif
{!! $append !!}
