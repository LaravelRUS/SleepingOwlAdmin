@if ($visibled)
<div class="input-group input-date soa-input-group" {!! $width !!}>
	@php
		$filterAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
			->merge(['data-date-format' => $pickerFormat, 'type' => 'text'])
			->class(['form-control', 'column-filter', 'input-daterange', 'soa-input']);
	@endphp
	<input {!! $filterAttributes !!} />

	{{-- Trying to save table filter column width space --}}
	{{--
	<span class="input-group-text soa-input-addon">
		<i class="far fa-calendar-alt"></i>
	</span>
	--}}
</div>
@if(!empty($helpText))
    <small class="form-text text-muted soa-help-text">{!! $helpText !!}</small>
@endif
@endif
