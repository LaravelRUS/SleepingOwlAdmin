<select class="form-control column-filter" data-type="select">
	<optgroup label="{{ $placeholder }}">
		@foreach ($options as $option)
			<option value="{{ $option }}">{{ $option }}</option>
		@endforeach
	</optgroup>
</select>