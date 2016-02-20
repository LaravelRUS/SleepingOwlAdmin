<div role="tabpanel">
	<ul class="nav nav-tabs" role="tablist">
		@foreach ($tabs as $tab)
			{!! $tab !!}
		@endforeach
	</ul>
	<div class="tab-content">
		@foreach ($tabs as $tab)
			{!! $tab->content() !!}
		@endforeach
	</div>
</div>