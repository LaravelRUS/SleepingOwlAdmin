@extends(AdminTemplate::getTemplateViewPath('_layout.base'))

@section('content')
	<div class="wrapper">
		<header class="main-header">
			@include(AdminTemplate::getTemplateViewPath('_partials.header'))
		</header>

		<aside class="main-sidebar">
			@include(AdminTemplate::getTemplateViewPath('_partials.navigation'))
		</aside>

		<div class="content-wrapper">
			<div class="content-header">
				<h1>
					{{{ $title }}}
				</h1>
			</div>

			<div class="content body">
				{!! $content !!}
			</div>
		</div>
	</div>
@stop