<div class="navbar-default sidebar" role="navigation">
	<div class="sidebar-nav navbar-collapse">
		<ul class="nav" id="side-menu">
			@foreach (Admin::instance()->getMenu() as $item)
				{!! $item !!}
			@endforeach
		</ul>
	</div>
</div>