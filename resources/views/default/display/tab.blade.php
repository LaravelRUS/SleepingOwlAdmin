{{-- <li {!! $attributes !!} class="nav-item">
    <a href="#{{ $name }}" aria-controls="{{ $name }}" role="tab" data-toggle="tab" class="nav-link">
        @if($icon)
            {!! $icon !!}
        @endif

        {{ $label }}
        @if($badge)
            {!! $badge->render() !!}
        @endif
    </a>
</li> --}}

<a class="nav-item nav-link {!! ($active) ? 'active' : '' !!}" id="{{ $name }}-tab" data-toggle="tab" href="#{{ $name }}" role="tab" aria-controls="{{ $name }}" aria-selected="true">
  {{ $label }}
</a>
