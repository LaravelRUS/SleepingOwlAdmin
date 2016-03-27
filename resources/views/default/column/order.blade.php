@if ($movableUp)
	<form action="{{ $moveUpUrl }}" method="POST" style="display:inline-block;">
		<input type="hidden" name="_token" value="{{ csrf_token() }}" />
		<button class="btn btn-default btn-sm" data-toggle="tooltip" title="{{ trans('sleeping_owl::lang.table.moveUp') }}">
			&uarr;
		</button>
	</form>
@endif
@if ($movableDown)
	<form action="{{ $moveDownUrl }}" method="POST" style="display:inline-block;">
		<input type="hidden" name="_token" value="{{ csrf_token() }}" />
		<button class="btn btn-default btn-sm" data-toggle="tooltip" title="{{ trans('sleeping_owl::lang.table.moveDown') }}">
			&darr;
		</button>
	</form>
@endif