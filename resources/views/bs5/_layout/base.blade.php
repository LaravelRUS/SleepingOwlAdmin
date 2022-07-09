<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
	{!! $template->renderMeta($title) !!}

	@if(null !== ($favicon = config('sleeping_owl.favicon')))
		<link rel="icon" href="{{ $favicon }}">
	@endif

	<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
	<!--[if lt IE 9]>
		<script src="//oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
		<script src="//oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
	<![endif]-->

	@stack('scripts')
    @include(AdminTemplate::getViewPath('_layout.color-template'))
    @stack('header-styles')
</head>

<body class="{{ config('sleeping_owl.body_default_class') }}">

    @yield('content')

    {!! $template->meta()->renderScripts(true) !!}
    @stack('footer-scripts')

{{--        @include(AdminTemplate::getViewPath('helper.autoupdate'))--}}
</body>
</html>
