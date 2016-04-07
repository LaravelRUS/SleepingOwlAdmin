<div class="row">
	@foreach ($columns as $columnItems)
		<div class="col-lg-{{ floor(12 / count($columns)) }}">
			@include(AdminTemplate::getViewPath('form.partials.elements'), ['items' => $columnItems])
		</div>
	@endforeach
</div>
