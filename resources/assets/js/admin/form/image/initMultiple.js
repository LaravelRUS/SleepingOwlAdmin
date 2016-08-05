$(() => {
    $('.imageUploadMultiple').each((index, item) => {
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
                _token: Admin.Settings.token
            }
        });

        var updateValue = () => {
            var values = [];
            $item.find('img[data-value]').each((index, item) => {
                values.push($(item).data('value'));
            });
            $input.val(values.join(','));
        };

        flow.assignBrowse($item.find('.imageBrowse'));

        flow.on('filesSubmitted', (file) => {
            flow.upload();
        });

        flow.on('fileSuccess', (file, message) => {
            flow.removeFile(file);

            $errors.html('');
            $group.removeClass('has-error');

            var result = $.parseJSON(message);
            var template = $($('#thumbnail_template').html());
            template.find('img').attr('src', result.url).attr('data-value', result.value);

            $innerGroup.append(template);

            updateValue();
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

        $item.on('click', '.imageRemove', (e) => {
            e.preventDefault();
            $(e.target).closest('.imageThumbnail').remove();
            updateValue();
        });

        $innerGroup.sortable({
            onUpdate: () => {
                updateValue();
            }
        });
    });
});