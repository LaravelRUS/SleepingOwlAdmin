@if ( ! empty($title))
	<div class="soa-display-title">
		<div>
			{!! $title !!}
		</div>
	</div>
@endif

@yield('before.card')
@yield('before.panel')

<div class="card soa-card {!! $card_class !!}">
	<div class="card-header soa-card-header">
		@if ($creatable)
			{{--
			Please do not add any additional classes to this button like mb-3 or other.
			For local visual changes use custom css file and selector .btn-create
			--}}
			<a href="{{ url($createUrl) }}" class="btn btn-primary btn-create soa-button soa-button-primary">
				<i class="fas fa-plus"></i> {{ $newEntryButtonText }}
			</a>
		@endif

		<div class="float-end block-actions soa-toolbar">
			@yield('card.heading.actions')
			@yield('panel.heading.actions')

			@yield('card.buttons')
			@yield('panel.buttons')
		</div>

	    @yield('card.heading')
    	@yield('panel.heading')
	</div>

	@include('sleeping_owl::features.datatables.layout-slots')

	@foreach($extensions as $ext)
		{!! $ext->render() !!}
	@endforeach

	@yield('card.footer')
	@yield('panel.footer')
</div>

@yield('after.card')
@yield('after.panel')
