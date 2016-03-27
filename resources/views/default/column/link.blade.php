@if($isEditable)
{!! link_to($link, $value, $linkAttributes) !!} {!! $append !!}
@else
    {{ $value }} {!! $append !!}
@endif