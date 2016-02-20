<div class="row">
	@foreach ($columns as $columnItems)
		<div class="col-lg-{{ floor(12 / count($columns)) }}">
			@foreach ($columnItems as $item)
				{!! $item !!}
			@endforeach
		</div>
	@endforeach
</div>
