@if ( ! empty($title))
	<div class="row">
		<div class="col-lg-12 pt-3">
			{!! $title !!}
		</div>
	</div>
	<br />
@endif

@yield('before.card')
@yield('before.panel')

<div class="card card-default {!! $card_class !!}">
	<div class="card-heading card-header">
		@if ($creatable)
			{{--
			Please do not add any additional classes to this button like mb-3 or other.
			For local visual changes use custom css file and selector .btn-create
			--}}
			<a href="{{ url($createUrl) }}" class="btn btn-primary btn-create">
				<i class="fas fa-plus"></i> {{ $newEntryButtonText }}
			</a>
		@endif

		<div class="pull-right block-actions">
			@yield('card.heading.actions')
			@yield('panel.heading.actions')

			@yield('card.buttons')
			@yield('panel.buttons')
		</div>

	    @yield('card.heading')
    	@yield('panel.heading')
	</div>

	@foreach($extensions as $ext)
		{!! $ext->render() !!}
	@endforeach

	@yield('card.footer')
	@yield('panel.footer')
</div>

@yield('after.card')
@yield('after.panel')
