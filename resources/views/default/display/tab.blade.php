<li {!! $attributes !!}>
    <a href="#{{ $name }}" aria-controls="{{ $name }}" role="tab" data-toggle="tab">
        @if($icon)
            {!! $icon !!}
        @endif

        {{ $label }}
        @if($badge)
            {!! $badge->render() !!}
        @endif
    </a>
</li>
