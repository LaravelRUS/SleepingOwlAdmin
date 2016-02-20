@extends(AdminTemplate::getTemplateViewPath('_layout.base'))

@section('content')
	<div id="wrapper">
		<nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
			@include(AdminTemplate::getTemplateViewPath('_partials.header'))
			@include(AdminTemplate::getTemplateViewPath('_partials.navigation'))
		</nav>

		<div id="page-wrapper">
			<div class="row">
				<div class="col-lg-12">
					<h1 class="page-header">{{{ $title }}}</h1>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-12">
					{!! $content !!}
				</div>
			</div>
		</div>
	</div>
@stop