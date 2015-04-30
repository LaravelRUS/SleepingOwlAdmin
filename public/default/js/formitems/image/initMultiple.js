$(function ()
{
	$('.imageUploadMultiple').each(function (index, item)
	{
		var $item = $(item);
		var $group = $item.closest('.form-group');
		var $innerGroup = $item.find('.form-group');
		var $errors = $item.find('.errors');
		var $input = $item.find('.imageValue');
		var flow = new Flow({
			target: $item.data('target'),
			testChunks: false,
			chunkSize: 1024 * 1024 * 1024,
			query: {
				_token: $item.data('token')
			}
		});
		var updateValue = function ()
		{
			var values = [];
			$item.find('img[data-value]').each(function ()
			{
				values.push($(this).data('value'));
			});
			$input.val(values.join(','));
		};
		flow.assignBrowse($item.find('.imageBrowse'));
		flow.on('filesSubmitted', function(file) {
			flow.upload();
		});
		flow.on('fileSuccess', function(file,message){
			flow.removeFile(file);

			$errors.html('');
			$group.removeClass('has-error');

			var result = $.parseJSON(message);

			$innerGroup.append('<div class="col-xs-6 col-md-3 imageThumbnail"><div class="thumbnail">' +
				'<img data-value="' + result.value + '" src="' + result.url + '" />' +
				'<a href="#" class="imageRemove">Remove</a></div></div>');
			updateValue();
		});
		flow.on('fileError', function(file, message){
			flow.removeFile(file);

			var response = $.parseJSON(message);
			var errors = '';
			$.each(response, function (index, error)
			{
				errors += '<p class="help-block">' + error + '</p>'
			});
			$errors.html(errors);
			$group.addClass('has-error');
		});
		$item.on('click', '.imageRemove', function (e)
		{
			e.preventDefault();
			$(this).closest('.imageThumbnail').remove();
			updateValue();
		});

		$innerGroup.sortable({
			onUpdate: function ()
			{
				updateValue();
			}
		});

	});
});