<option data-method="{{ $method }}" value="{{ $action }}"{{ !$selected ? '': ' selected' }}>
    @if ($icon)
        {!! $icon !!}&nbsp;
    @endif
    {{ $title }}
</option>
