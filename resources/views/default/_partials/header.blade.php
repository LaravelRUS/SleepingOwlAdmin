<a href="#" class="logo">
	{{{ config('sleeping_owl.title') }}}
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