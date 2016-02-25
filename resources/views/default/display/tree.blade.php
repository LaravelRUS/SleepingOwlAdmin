@if ($creatable)
	<a class="btn btn-primary" href="{{ $createUrl }}"><i class="fa fa-plus"></i> {{ trans('sleeping_owl::lang.table.new-entry') }}</a>
@endif
<div class="dd nestable" data-url="{{ $url }}/reorder">
	<ol class="dd-list">
		@include(AdminTemplate::getViewPath('display.tree_children'), ['children' => $items])
	</ol>
</div>