@if ($editable)
	<a href="{{ $editUrl }}" class="btn btn-default btn-xs" data-toggle="tooltip" title="{{ trans('admin::lang.table.edit') }}"><i class="fa fa-pencil"></i></a>
@endif
@if ($deletable)
	<form action="{{ $deleteUrl }}" method="POST" style="display:inline-block;">
		<input type="hidden" name="_token" value="{{ csrf_token() }}" />
		<input type="hidden" name="_method" value="DELETE" />
		<button class="btn btn-danger btn-xs btn-delete" data-toggle="tooltip" title="{{ trans('admin::lang.table.delete') }}">
			<i class="fa fa-times"></i>
		</button>
	</form>
@endif
@if ($restorable)
	<form action="{{ $restoreUrl }}" method="POST" style="display:inline-block;">
		<input type="hidden" name="_token" value="{{ csrf_token() }}" />
		<button class="btn btn-primary btn-xs" data-toggle="tooltip" title="{{ trans('admin::lang.table.restore') }}">
			<i class="fa fa-reply"></i>
		</button>
	</form>
@endif
