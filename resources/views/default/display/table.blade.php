@if ( ! empty($title))
	<div class="row">
		<div class="col-lg-12 pt-3">
			{!! $title !!}
		</div>
	</div>
	<br />
@endif

@yield('before.card')

<div class="card card-default {!! $panel_class !!}">
	<div class="card-heading card-header">
		@if ($creatable)
			<a href="{{ url($createUrl) }}" class="btn btn-primary">
				<i class="fas fa-plus"></i> {{ $newEntryButtonText }}
			</a>
		@endif

		<div class="pull-right">
			@yield('card.heading.actions')
		</div>

		@yield('card.buttons')

	</div>

	@yield('card.heading')

	@foreach($extensions as $ext)
		{!! $ext->render() !!}
	@endforeach

	@yield('card.footer')
</div>

@yield('after.panel')
