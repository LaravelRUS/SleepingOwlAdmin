<ul class="nav navbar-nav ">
	<li class="nav-item">
		<a class="nav-link" data-widget="pushmenu"><i class="fas fa-bars"></i></a>
	</li>
	@stack('navbar.left')

	@stack('navbar')
</ul>

<ul class="navbar-nav ml-auto">
	@stack('navbar.right')
</ul>
