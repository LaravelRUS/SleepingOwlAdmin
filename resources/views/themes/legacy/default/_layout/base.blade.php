<!DOCTYPE html>
@php($colorScheme = ($_COOKIE['theme-mode'] ?? 'light') === 'dark' ? 'dark' : 'light')
<html lang="{{ app()->getLocale() }}" data-bs-theme="{{ $colorScheme }}" data-color-scheme="{{ $colorScheme }}">
<head>
	{!! $template->renderMeta($title) !!}
	@include('sleeping_owl::shared.theme.runtime_properties')
	@if(null !== ($favicon = config('sleeping_owl.favicon')))
		<link rel="icon" href="{{ $favicon }}">
	@endif

	@stack('scripts')
</head>
<body class="{{ config('sleeping_owl.body_default_class', 'sidebar-mini sidebar-open') . (@$_COOKIE['sidebar-state'] == 'sidebar-collapse' ? ' sidebar-collapse' : '') }}">
	@yield('content')
	@include(AdminTemplate::getViewPath('_partials.tooltip'))
	@include(AdminTemplate::getViewPath('helper.scrolltotop'))

	{!! $template->meta()->renderScripts(true) !!}
	@stack('footer-scripts')

	@include(AdminTemplate::getViewPath('helper.autoupdate'))
</body>
</html>
