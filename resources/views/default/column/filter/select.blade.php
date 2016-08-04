<select {!! $attributes !!}>
	<option value="">- {{ $placeholder }} -</option>
	@foreach ($options as $key => $option)
		<option value="{{ $key }}">{{ $option }}</option>
	@endforeach
</select>
