<div class="input-group input-date" {!! $width !!}>
	<input
		data-date-format="{{ $pickerFormat }}"
		class="form-control column-filter input-daterange"
		type="text"
		{!! $attributes !!} />

	{{-- Trying to save table filter column width space --}}
	{{--
	<div class="input-group-prepend input-group-addon">
		<div class="input-group-text">
			<span class="far fa-calendar-alt"></span>
		</div>
	</div>
	--}}
</div>
