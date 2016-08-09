<section class="sidebar">

	@yield('sidebar.top')

	<ul class="sidebar-menu">
		@yield('sidebar.ul.top')

		{!! $template->renderNavigation() !!}

		@yield('sidebar.ul.bottom')
	</ul>

	@yield('sidebar.bottom')
</section>