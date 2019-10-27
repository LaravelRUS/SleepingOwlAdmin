<ul class="nav navbar-nav ">
	<li class="nav-item">
		<a class="nav-link" data-widget="pushmenu"><i class="fas fa-bars"></i></a>
	</li>

	{{-- dev or not? --}}
	<li class="nav-item">
		<a class="nav-link" href="javascript:localStorage.clear()" data-toggle="tooltip" title="{{ trans('sleeping_owl::lang.button.remove') }} LocalStorage">
			<i class="fas fa-eraser"></i>
		</a>
	</li>

	@stack('navbar.left')

	@stack('navbar')
</ul>

<ul class="navbar-nav ml-auto">
	@stack('navbar.right')
</ul>
