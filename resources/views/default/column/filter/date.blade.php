<div class="input-date form-group input-group" style="width:{{ $width }}px">
	<input
			data-date-format="{{ $pickerFormat }}"
			data-date-useseconds="{{ $seconds ? 'true' : 'false' }}"
			class="form-control column-filter"
			type="text"
			placeholder="{{ $placeholder }}"
			{!! $attributes !!} >

	<span class="input-group-addon">
		<span class="fa fa-calendar"></span>
	</span>
</div>
