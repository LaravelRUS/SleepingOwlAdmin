<div role="tabpanel" class="nav-tabs-custom ">
	<ul class="nav nav-tabs" role="tablist">
	@foreach ($tabs as $tab)
		{!! $tab->render() !!}
	@endforeach
	</ul>
	<div class="tab-content">
	@foreach ($tabs as $tab)
		<div role="tabpanel" class="tab-pane {!! ($tab->isActive()) ? 'in active' : '' !!}" id="{{ $tab->getName() }}">
			{!! $tab->getContent()->render() !!}
		</div>
	@endforeach
	</div>
</div>