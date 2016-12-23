@if (!empty($value))
{!! HTML::mailto($value, $value) !!}
@endif
{!! $append !!}