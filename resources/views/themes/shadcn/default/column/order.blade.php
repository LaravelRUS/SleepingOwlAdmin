<div class="order-block soa-button-group">
	@if ($movableUp)
		<form action="{{ $moveUpUrl }}" method="POST">
			<input type="hidden" name="_token" value="{{ csrf_token() }}" />
			<button class="btn btn-info btn-sm soa-button soa-button-sm soa-button-secondary" data-toggle="tooltip" data-bs-toggle="tooltip" title="{{ trans('sleeping_owl::lang.button.moveUp') }}">
				&uarr;
			</button>
		</form>
	@endif
	@if ($movableDown)
		<form action="{{ $moveDownUrl }}" method="POST">
			<input type="hidden" name="_token" value="{{ csrf_token() }}" />
			<button class="btn btn-danger btn-sm soa-button soa-button-sm soa-button-danger" data-toggle="tooltip" data-bs-toggle="tooltip" title="{{ trans('sleeping_owl::lang.button.moveDown') }}">
				&darr;
			</button>
		</form>
	@endif
</div>
