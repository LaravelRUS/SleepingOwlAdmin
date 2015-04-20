@extends('admin::default._layout.base')

@section('content')
	<div id="wrapper">
		<nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
			@include('admin::default._partials.header')
			<?
			//@include('admin::default._partials.user')
			?>
			@include('admin::default._partials.menu')
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