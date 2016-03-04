@if ( ! empty($title))
	<div class="row">
		<div class="col-lg-12">
			<h2 class="page-title"><small>{{ $title }}</small></h2>
		</div>
	</div>
@endif

@yield('before.panel')

<div class="panel panel-default">
	<div class="panel-heading">
		@if ($creatable)
			<a href="{{ url($createUrl) }}" class="btn btn-primary btn-flat">
				<i class="fa fa-plus"></i> {{ trans('sleeping_owl::lang.table.new-entry') }}
			</a>
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
