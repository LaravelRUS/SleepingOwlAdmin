@php
    $tabAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))
        ->merge(['data-soa-tab' => true])
        ->class(['nav-item', 'nav-link', 'active' => $active]);
@endphp
<a {!! $tabAttributes !!}
   href="#nav-{{ $name }}"
   role="tab" aria-selected="{{ $active ? 'true' : 'false' }}" aria-controls="nav-{{ $name }}">
    @if($icon)
        {!! $icon !!}
    @endif

    {!! $label !!}
    @if($badge)
        {!! $badge->render() !!}
    @endif
</a>
