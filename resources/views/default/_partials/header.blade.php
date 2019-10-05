<ul class="nav navbar-nav ">
	<li class="nav-item">
		<a class="nav-link" data-widget="pushmenu" href="#"><i class="fas fa-bars"></i></a>
	</li>
	@stack('navbar.left')

	{{-- ======================= --}}
	<li class="nav-item d-none d-sm-inline-block">
		<a href="{{ url(config('sleeping_owl.url_prefix')) }}" class="nav-link">
			<i class="fas fa-home fa-lg" aria-hidden="true"></i>
		</a>
	</li>
	<li class="nav-item d-none d-sm-inline-block">
		<span class="nav-link">{!! $title !!}</span>
	</li>
	{{-- ======================= --}}

	@stack('navbar')
</ul>

<!-- SEARCH FORM -->
{{-- <form class="form-inline ml-3">
	<div class="input-group input-group-sm">
		<input class="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search">
		<div class="input-group-append">
			<button class="btn btn-navbar" type="submit">
				<i class="fas fa-search"></i>
			</button>
		</div>
	</div>
</form> --}}

<ul class="navbar-nav ml-auto">
	@stack('navbar.right')
</ul>
