<div class="clear-form soa-form">
	<form {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []) !!}>
		<input type="hidden" name="_redirectBack" value="{{ $backUrl }}"/>
		<input type="hidden" name="_token" value="{{ csrf_token() }}"/>
		<div class="clear-form-body soa-form-body">
			@include(AdminTemplate::getViewPath('form.partials.elements'), ['items' => $items])
		</div>

		<div class="clear-form-footer soa-form-actions">
			{!! $buttons !!}
		</div>
	</form>
</div>
