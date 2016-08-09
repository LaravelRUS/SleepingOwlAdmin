@extends($template->getViewPath('_layout.base'))

@section('content')
	<div class="wrapper">
		<header class="main-header">
			@include($template->getViewPath('_partials.header'))
		</header>

		<aside class="main-sidebar">
			@include($template->getViewPath('_partials.navigation'))
		</aside>

		<div class="content-wrapper">
			{!! $template->renderBreadcrumbs($breadcrumbKey) !!}

			<div class="content-header">
				<h1>
					{{{ $title }}}
				</h1>
			</div>

			<div class="content body">
				@if($successMessage)
				<div class="alert alert-success alert-message">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
					{!! $successMessage !!}
				</div>
				@endif

				{!! $content !!}
			</div>
		</div>
	</div>
@stop