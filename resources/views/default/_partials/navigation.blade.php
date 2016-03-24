<section class="sidebar">

	@yield('sidebar.top')

	<ul class="sidebar-menu">
		@yield('sidebar.ul.top')

		{!! app('sleeping_owl.navigation')->render() !!}

		@yield('sidebar.ul.bottom')
	</ul>

	@yield('sidebar.bottom')
</section>