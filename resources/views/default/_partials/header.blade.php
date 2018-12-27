<ul class="nav navbar-nav ">
	<li class="nav-item">
		<a class="nav-link" data-widget="pushmenu" href="#"><i class="fa fa-bars"></i></a>
	</li>
	@stack('navbar.left')

	{{-- ======================= --}}
	<li class="nav-item d-none d-sm-inline-block">
		<a href="{{ url(config('sleeping_owl.url_prefix')) }}" class="nav-link">
			<i class="fa fa-home fa-lg" aria-hidden="true"></i>
		</a>
	</li>
	<li class="nav-item d-none d-sm-inline-block">
		<span class="nav-link">{!! $title !!}</span>
	</li>
	{{-- ======================= --}}

	@stack('navbar')
</ul>

<!-- SEARCH FORM -->
<form class="form-inline ml-3">
	<div class="input-group input-group-sm">
		<input class="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search">
		<div class="input-group-append">
			<button class="btn btn-navbar" type="submit">
				<i class="fa fa-search"></i>
			</button>
		</div>
	</div>
</form>

		<ul class="navbar-nav ml-auto">
			@stack('navbar.right')


			{{-- ======================= --}}
			{{-- <li class="nav-item dropdown">
				<a class="nav-link" data-toggle="dropdown" href="#">
					<i class="fa fa-bell-o"></i>
					<span class="badge badge-warning navbar-badge">15</span>
				</a>
				<div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
					<span class="dropdown-item dropdown-header">15 Notifications</span>
					<div class="dropdown-divider"></div>
					<a href="#" class="dropdown-item">
						<i class="fa fa-envelope mr-2"></i> 4 new messages
						<span class="float-right text-muted text-sm">3 mins</span>
					</a>
					<div class="dropdown-divider"></div>
					<a href="#" class="dropdown-item">
						<i class="fa fa-users mr-2"></i> 8 friend requests
						<span class="float-right text-muted text-sm">12 hours</span>
					</a>
					<div class="dropdown-divider"></div>
					<a href="#" class="dropdown-item">
						<i class="fa fa-file mr-2"></i> 3 new reports
						<span class="float-right text-muted text-sm">2 days</span>
					</a>
					<div class="dropdown-divider"></div>
					<a href="#" class="dropdown-item dropdown-footer">See All Notifications</a>
				</div>
			</li>

			<li class="nav-item">
				<a class="nav-link" data-widget="control-sidebar" data-slide="true" href="#">
					<i class="fa fa-th-large"></i>
				</a>
			</li> --}}
				{{-- ======================= --}}

			</ul>
