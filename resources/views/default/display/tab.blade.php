<li role="presentation" {!! ($active) ? 'class="active"' : '' !!}>
    <a href="#{{ $name }}" aria-controls="{{ $name }}" role="tab" data-toggle="tab">
        @if($icon)
        {!! $icon !!}
        @endif

        {{ $label }}
    </a>
</li>