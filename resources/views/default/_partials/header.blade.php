<a href="{{ url(config('sleeping_owl.url_prefix')) }}" class="logo">
	<span class="logo-lg">{!! AdminTemplate::getLogo() !!}</span>
	<span class="logo-mini">{!! AdminTemplate::getLogoMini() !!}</span>
</a>

<nav class="navbar navbar-static-top" role="navigation">
	<!-- Sidebar toggle button-->
	<a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
		<span class="sr-only">Toggle navigation</span>
	</a>
	@stack('navbar.left')	
	<div class="navbar-custom-menu">	
		<ul class="nav navbar-nav">
			@stack('navbar')
		</ul>

		<ul class="nav navbar-nav navbar-right">
			@stack('navbar.right')
		</ul>
	</div>
</nav>
