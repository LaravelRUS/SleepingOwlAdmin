<div class="navbar-default sidebar" role="navigation">
	<div class="sidebar-nav navbar-collapse">
		<ul class="nav" id="side-menu">
		@foreach(AdminNavigation::getRootSection()->getPages() as $item)
			<li @if($item->isActive())class="active"@endif>
				<a href="{{ $item->getUrl() }}">
					{!! $item->getIcon() !!}
					<span class="mm-text">{!! $item->getName() !!}</span>
				</a>
			</li>
		@endforeach

		@foreach(AdminNavigation::getRootSection()->getSections() as $section)
			@include('cms::navigation.sections', ['section' => $section])
		@endforeach
		</ul>
	</div>
</div>