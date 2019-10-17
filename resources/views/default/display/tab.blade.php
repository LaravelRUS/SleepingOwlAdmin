<a {!! $attributes !!}
   href="#nav-{{ $name }}"
   aria-selected="true" aria-controls="nav-{{ $name }}">
    @if($icon)
        {!! $icon !!}
    @endif

    {!! $label !!}
    @if($badge)
        {!! $badge->render() !!}
    @endif
</a>
