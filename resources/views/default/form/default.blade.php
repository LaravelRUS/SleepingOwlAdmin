<form {!! $attributes !!}>

	<input type="hidden" name="_redirectBack" value="{{ $backUrl }}" />
	<input type="hidden" name="_token" value="{{ csrf_token() }}" />

	@include(AdminTemplate::getViewPath('form.partials.elements'), ['items' => $formItems])

	{!! $buttons->render() !!}
</form>