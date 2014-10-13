@extends('admin::_layout.base')

@section('content')
	<div id="wrapper">
		<nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
			@include('admin::_partials.header')
			@include('admin::_partials.user')
			@include('admin::_partials.menu')
		</nav>
		<div id="page-wrapper">
			@yield('innerContent')
		</div>
	</div>
@stop