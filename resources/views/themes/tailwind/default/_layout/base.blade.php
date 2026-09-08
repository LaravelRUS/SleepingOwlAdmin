<!DOCTYPE html>
@php
    $colorScheme = ($_COOKIE['theme-mode'] ?? 'light') === 'dark' ? 'dark' : 'light';
    $bodyClasses = trim('soa-body '.config('sleeping_owl.body_default_class', 'sidebar-mini sidebar-open')
        .(($_COOKIE['sidebar-state'] ?? null) === 'sidebar-collapse' ? ' sidebar-collapse' : ''));
@endphp
<html lang="{{ app()->getLocale() }}" data-bs-theme="{{ $colorScheme }}" data-color-scheme="{{ $colorScheme }}">
<head>
    {!! $template->renderMeta($title) !!}
    @include('sleeping_owl::shared.theme.runtime_properties')

    @if(null !== ($favicon = config('sleeping_owl.favicon')))
        <link rel="icon" href="{{ $favicon }}">
    @endif

    @stack('scripts')
</head>
<body class="{{ $bodyClasses }}">
    @yield('content')
    @include(AdminTemplate::getViewPath('_partials.tooltip'))
    @include(AdminTemplate::getViewPath('helper.scrolltotop'))
    @include(AdminTemplate::getViewPath('helper.autoupdate'))

    {!! $template->meta()->renderScripts(true) !!}
    @stack('footer-scripts')
</body>
</html>
