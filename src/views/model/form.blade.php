@extends('admin::_layout.inner')

@section('innerContent')
	<div class="row">
		<div class="col-lg-12">
			<h1 class="page-header">{{{ $title }}}</h1>
		</div>
	</div>
	<div class="row">
		<div class="col-lg-12">
			{!! $form->render() !!}
		</div>
	</div>
@stop