<div class="clear-form">
	<form {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []) !!}>
		<input type="hidden" name="_redirectBack" value="{{ $backUrl }}"/>
		<input type="hidden" name="_token" value="{{ csrf_token() }}"/>
		<div class="clear-form-body">
			@include(AdminTemplate::getViewPath('form.partials.elements'), ['items' => $items])
		</div>

		<div class="clear-form-footer">
			{!! $buttons !!}
		</div>
	</form>
</div>
