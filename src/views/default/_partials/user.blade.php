<ul class="nav navbar-top-links navbar-right">
	<li class="dropdown">
		<a class="dropdown-toggle" data-toggle="dropdown" href="#">
			<i class="fa fa-user fa-fw"></i> {{ $user->name ?: 'admin' }} <i class="fa fa-caret-down"></i>
		</a>
		<ul class="dropdown-menu dropdown-user">
			<li><a href="{{ Admin::instance()->router->routeToAuth('logout') }}"><i class="fa fa-sign-out fa-fw"></i> {{ Lang::get('admin::lang.auth.logout') }}</a></li>
		</ul>
	</li>
</ul>
