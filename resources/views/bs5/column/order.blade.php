<div class="order-block">
	@if ($movableUp)
		<form action="{{ $moveUpUrl }}" method="POST">
			<input type="hidden" name="_token" value="{{ csrf_token() }}" />
			<button class="btn btn-info btn-xs" data-toggle="tooltip" title="{{ trans('sleeping_owl::lang.button.moveUp') }}">
				&uarr;
			</button>
		</form>
	@endif
	@if ($movableDown)
		<form action="{{ $moveDownUrl }}" method="POST">
			<input type="hidden" name="_token" value="{{ csrf_token() }}" />
			<button class="btn btn-danger btn-xs" data-toggle="tooltip" title="{{ trans('sleeping_owl::lang.button.moveDown') }}">
				&darr;
			</button>
		</form>
	@endif
</div>
