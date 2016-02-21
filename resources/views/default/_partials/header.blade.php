<div class="navbar-header">
	<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
		<span class="sr-only">Toggle navigation</span>
		<span class="icon-bar"></span>
		<span class="icon-bar"></span>
		<span class="icon-bar"></span>
	</button>
	<a class="navbar-brand" href="#">{{{ config('sleeping_owl.title') }}}</a>
</div>

<ul class="nav navbar-nav">
	@yield('navbar')
</ul>

<ul class="nav navbar-nav navbar-right">
	@yield('navbar.right')
</ul>
