<div class="input-group input-date form-group date" style="width:{{ $width }}px">
	<input
		data-date-format="{{ $pickerFormat }}"
		data-date-useseconds="{{ $seconds ? 'true' : 'false' }}"
		class="form-control column-filter"
		type="text"
		placeholder="{{ $placeholder }}"
		aria-label="{{ $placeholder }}"
		{!! $attributes !!} />

	<div class="input-group-prepend input-group-addon">
		<div class="input-group-text">
			<span class="far fa-calendar-alt"></span>
		</div>
	</div>
</div>
