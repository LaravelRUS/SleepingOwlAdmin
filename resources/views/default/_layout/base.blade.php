<!DOCTYPE html>
<html lang="en">
<head>
	{!!
		Meta::setTitle(AdminTemplate::makeTitle($title))
			->addMeta(['charset' => 'utf-8'], 'meta::charset')
			->addMeta(['content' => csrf_token(), 'name' => 'csrf-token'])
			->addMeta(['content' => 'width=device-width, initial-scale=1', 'name' => 'viewport'])
			->addMeta(['content' => 'IE=edge', 'http-equiv' => 'X-UA-Compatible'])
			->render()
	!!}

	<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
	<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
		<script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
	<![endif]-->

	@stack('scripts')
</head>
<body class="skin-blue sidebar-mini">
	@yield('content')

	{!! Meta::renderScripts(true) !!}
	@stack('footer-scripts')
</body>
</html>