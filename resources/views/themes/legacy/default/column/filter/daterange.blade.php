@if ($visibled)
<div class="input-group input-date" {!! $width !!}>
	@php
		$filterAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
			->merge(['data-date-format' => $pickerFormat, 'type' => 'text'])
			->class(['form-control', 'column-filter', 'input-daterange']);
	@endphp
	<input {!! $filterAttributes !!} />

	{{-- Trying to save table filter column width space --}}
	{{--
	<div class="input-group-prepend input-group-addon">
		<div class="input-group-text">
			<span class="far fa-calendar-alt"></span>
		</div>
	</div>
	--}}
</div>
@if(!empty($helpText))
    <small class="form-text text-muted">{!! $helpText !!}</small>
@endif
@endif
