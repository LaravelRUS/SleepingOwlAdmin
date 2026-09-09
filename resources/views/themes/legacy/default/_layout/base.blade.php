<!DOCTYPE html>
@php($colorScheme = ($_COOKIE['theme-mode'] ?? 'light') === 'dark' ? 'dark' : 'light')
<html lang="{{ app()->getLocale() }}" data-bs-theme="{{ $colorScheme }}" data-color-scheme="{{ $colorScheme }}">
<head>
	{!! $template->renderMeta($title) !!}
	@include('sleeping_owl::shared.theme.runtime_properties')
	@if(null !== ($favicon = config('sleeping_owl.ui.favicon')))
		<link rel="icon" href="{{ $favicon }}">
	@endif

	@stack('scripts')
</head>
<body class="{{ config('sleeping_owl.ui.body_default_class', '') . (@$_COOKIE['sidebar-state'] == 'sidebar-collapse' ? ' sidebar-collapse' : '') }}">
	@yield('content')
	@include(AdminTemplate::getViewPath('_partials.tooltip'))
	@include(AdminTemplate::getViewPath('helper.scrolltotop'))
	@include(AdminTemplate::getViewPath('helper.autoupdate'))

	{!! $template->meta()->renderScripts(true) !!}
	@stack('footer-scripts')
</body>
</html>
