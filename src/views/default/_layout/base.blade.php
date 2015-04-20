<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="csrf-token" content="{{ csrf_token() }}">

	<title>{{{ $title }}}</title>

	@foreach (\SleepingOwl\Admin\AssetManager\AssetManager::styles() as $style)
		<link media="all" type="text/css" rel="stylesheet" href="{{ $style }}" >
	@endforeach

	<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
	<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
		<script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
	<![endif]-->

	@foreach (\SleepingOwl\Admin\AssetManager\AssetManager::scripts() as $script)
		<script src="{{ $script }}"></script>
	@endforeach
</head>
<body>
	@yield('content')
</body>
</html>