<section class="sidebar">

	@yield('sidebar.top')

	<ul class="sidebar-menu">
		@yield('sidebar.ul.top')

		{!! AdminNavigation::render() !!}

		@yield('sidebar.ul.bottom')
	</ul>

	@yield('sidebar.bottom')
</section>