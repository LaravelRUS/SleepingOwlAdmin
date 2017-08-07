@extends(AdminTemplate::getViewPath('_layout.base'))

@section('content')
	<div class="wrapper" id="vueApp">
		<header class="main-header">
			@include(AdminTemplate::getViewPath('_partials.header'))
		</header>

		<aside class="main-sidebar">
			@include(AdminTemplate::getViewPath('_partials.navigation'))
		</aside>

		<div class="content-wrapper">
			{!! $template->renderBreadcrumbs($breadcrumbKey) !!}

			<div class="content-header">
				<h1>
					{{{ $title }}}
				</h1>
			</div>

			<div class="content body">
				@stack('content.top')

				{!! $content !!}

				@stack('content.bottom')
			</div>
		</div>
	</div>
@stop
