<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}">{{ $label }}</label>
	<div class="dropzone" action="{{ route('admin.formitems.image.upload') }}" id="{{ $name }}">
	</div>
	<input name="{{ $name }}" type="text" value="{{ $value }}">
	@include(AdminTemplate::view('formitem.errors'))
</div>
<script>
	Dropzone.options.{{ $name }} = {
		addRemoveLinks : true,
		maxFiles : 1,
		params : {
			_token : "{{ csrf_token() }}"
		},
		init : function ()
		{
			var $this = this;
			this.on('addedfile', function (file)
			{
				$.each(this.files, function (index, item)
				{
					if (item != file)
					{
						$this.removeFile(item);
					}
				});
			});
			this.on('success', function (file, response)
			{
				var input = $('input[name="{{ $name }}"]');
				input.val(response);
			});
		}
	};
</script>