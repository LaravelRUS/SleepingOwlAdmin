<select class="form-control column-filter" data-type="select">
	<option value="">- {{ $placeholder }} -</option>
	@foreach ($options as $option)
		<option value="{{ $option }}">{{ $option }}</option>
	@endforeach
</select>