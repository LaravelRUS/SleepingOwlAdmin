@if ( ! empty($title))
	<div class="row">
		<div class="col-lg-12">
			{!! $title !!}
		</div>
	</div>
	<br />
@endif

@yield('before.panel')

<div class="panel panel-default {!! $panel_class !!}">
	<div class="panel-heading">
		@if ($creatable)
			<a href="{{ url($createUrl) }}" class="btn btn-primary">
				<i class="fa fa-plus"></i> {{ $newEntryButtonText }}
			</a>
		@endif

		@if ($creatable)
			<button id="new-entry-open-dialog-button"  class="btn btn-primary" data-toggle="modal" data-target="#new-entry-dialog">
				<i class="fa fa-plus"></i> {{ $newEntryButtonText }} Modal
			</button>

			<modal id="new-entry-dialog" title="{{ $newEntryButtonText }}" style="display: none;">{!! $createForm !!} </modal>
		@endif

		@yield('panel.buttons')

		<div class="pull-right">
			@yield('panel.heading.actions')
		</div>
	</div>

	@yield('panel.heading')

	@foreach($extensions as $ext)
		{!! $ext->render() !!}
	@endforeach

	@yield('panel.footer')
</div>

@yield('after.panel')
