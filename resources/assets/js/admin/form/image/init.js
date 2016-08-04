$(() => {
    $('.imageUpload').each((index, item) => {
        var $item = $(item);
        var $group = $item.closest('.form-group');
        var $errors = $item.find('.errors');
        var $noValue = $item.find('.no-value');
        var $hasValue = $item.find('.has-value');
        var $thumbnail = $item.find('.thumbnail img.has-value');
        var $input = $item.find('.imageValue');
        var flow = new Flow({
            target: $item.data('target'),
            testChunks: false,
            chunkSize: 1024 * 1024 * 1024,
            query: {
                _token: $item.data('token')
            }
        });

        flow.assignBrowse($item.find('.imageBrowse'), false, true)

        flow.on('filesSubmitted', (file) => {
            flow.upload();
        });

        flow.on('fileSuccess', (file, message) => {
            flow.removeFile(file);

            $errors.html('');
            $group.removeClass('has-error');

            var result = $.parseJSON(message);
            $thumbnail.attr('src', result.url);
            $hasValue.find('span').text(result.value);
            $input.val(result.value);
            $noValue.addClass('hidden');
            $hasValue.removeClass('hidden');
        });

        flow.on('fileError', (file, message) => {
            flow.removeFile(file);

            var response = $.parseJSON(message);
            var errors = '';

            $.each(response, (index, error) => {
                errors += '<p class="help-block">' + error + '</p>'
            });

            $errors.html(errors);
            $group.addClass('has-error');
        });

        $item.find('.imageRemove').on('click', function () {
            $input.val('');
            $noValue.removeClass('hidden');
            $hasValue.addClass('hidden');
        });
    });
});