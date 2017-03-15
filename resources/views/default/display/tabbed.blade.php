<div role="tabpanel" class="nav-tabs-custom ">
	<ul class="nav nav-tabs" role="tablist">
	@foreach ($tabs as $tab)
		{!! $tab->render() !!}
	@endforeach
	</ul>
	<div class="tab-content">
	@foreach ($tabs as $tab)
		<div role="tabpanel" class="tab-pane {!! ($tab->isActive()) ? 'in active' : '' !!}" id="{{ $tab->getName() }}">
			@if($tab->getContent() instanceof \SleepingOwl\Admin\Form\FormDefault)
				@php
					$getForm = $tab->getContent();
				@endphp

				{!!

                    $getForm->addElement(
                        new \SleepingOwl\Admin\Form\FormElements([
                            AdminFormElement::hidden('sleeping_owl_tab_id')->setDefaultValue($tab->getName())
                        ])
                    )->render()

                !!}
			@else

				{!!  $tab->getContent()->render() !!}
			@endif
		</div>
	@endforeach
	</div>
</div>