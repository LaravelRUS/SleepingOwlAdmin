@php
    $tabAttributes = (new \Illuminate\View\ComponentAttributeBag($attributesArray))
        ->merge(['data-toggle' => 'tab'])
        ->class(['nav-item', 'nav-link', 'active' => $active]);
@endphp
<a {!! $tabAttributes !!}
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
