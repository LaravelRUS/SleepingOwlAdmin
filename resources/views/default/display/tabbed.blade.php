<nav>
  <div class="nav nav-tabs" id="nav-tab" role="tablist">
		@foreach ($tabs as $tab)
			{!! $tab->render() !!}
		@endforeach
  </div>
</nav>

<div class="tab-content" id="nav-tabContent">
	@foreach ($tabs as $tab)
	  <div class="tab-pane fade {!! ($tab->isActive()) ? 'show active' : '' !!}" id="{{ $tab->getName() }}" role="tabpanel" aria-labelledby="{{ $tab->getName() }}-tab">
			{!! $tab->addTabElement()->getContent()->render() !!}
		</div>
	@endforeach
</div>



{{-- <div role="tabpanel" class="nav-tabs-custom ">
	<ul class="nav nav-tabs" role="tablist">
	@foreach ($tabs as $tab)
		{!! $tab->render() !!}
	@endforeach
	</ul>
	<div class="tab-content">
	@foreach ($tabs as $tab)
		<div role="tabpanel" class="tab-pane {!! ($tab->isActive()) ? 'in active' : '' !!}" id="{{ $tab->getName() }}">
			{!!  $tab->addTabElement()->getContent()->render() !!}
		</div>
	@endforeach
	</div>
</div> --}}
