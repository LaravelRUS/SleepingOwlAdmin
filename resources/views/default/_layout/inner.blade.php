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
				@yield('content.top')

				{!! $content !!}

				@yield('content.bottom')
			</div>
		</div>
	</div>
@stop