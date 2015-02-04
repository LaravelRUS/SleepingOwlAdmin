<div class="navbar-default sidebar" role="navigation">
	<div class="sidebar-nav navbar-collapse">
		<ul class="nav" id="side-menu">
			@foreach ($menu as $item)
				{!! $item->render() !!}
			@endforeach
		</ul>
	</div>
</div>