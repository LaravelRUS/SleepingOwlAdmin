@if ( ! empty($title))
	<div class="row">
		<div class="col-lg-12 pt-3">
			{!! $title !!}
		</div>
	</div>
	<br />
@endif

@yield('before.panel')

<div class="panel card panel-default {!! $panel_class !!}">
	<div class="panel-heading card-header">
		@if ($creatable)
			<a href="{{ url($createUrl) }}" class="btn btn-primary">
				<i class="fas fa-plus"></i> {{ $newEntryButtonText }}
			</a>
		@endif

		<div class="pull-right">
			@yield('panel.heading.actions')
		</div>

		@yield('panel.buttons')

	</div>

	@yield('panel.heading')

	@foreach($extensions as $ext)
		{!! $ext->render() !!}
	@endforeach

	@yield('panel.footer')
</div>

@yield('after.panel')
