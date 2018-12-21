<div class="sidebar">

	@stack('sidebar.top')

		<a href="{{ url(config('sleeping_owl.url_prefix')) }}" class="brand-link">
			{!! AdminTemplate::getLogo() !!}
			<span class="brand-text font-weight-light">{!! AdminTemplate::getTitle() !!}</span>
		</a>
		<nav class="mt-2">
			<ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

				<li class="nav-header">EXAMPLES</li>

				@stack('sidebar.ul.top')
				{!! $template->renderNavigation() !!}
			</ul>
		</nav>


		@stack('sidebar.ul.bottom')

	@stack('sidebar.bottom')
</div>
