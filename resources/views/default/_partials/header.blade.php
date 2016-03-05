<a href="{{ url(config('sleeping_owl.url_prefix')) }}" class="logo">
	<span class="logo-lg">{!! AdminTemplate::getLogo() !!}</span>
	<span class="logo-mini">{!! AdminTemplate::getLogoMini() !!}</span>
</a>

<nav class="navbar navbar-static-top" role="navigation">
	<!-- Sidebar toggle button-->
	<a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
		<span class="sr-only">Toggle navigation</span>
	</a>

	<ul class="nav navbar-nav">
		@yield('navbar')
	</ul>

	<ul class="nav navbar-nav navbar-right">
		@yield('navbar.right')
	</ul>
</nav>