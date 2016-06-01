$(function () {
    $('.adminCheckboxRow').on('change', function(e) {
        var $self = $(this),
            $row = $self.closest('tr');

        if($self.is(':checked')) {
            $row.addClass('info');
        } else {
            $row.removeClass('info');
        }
    });

    $('.adminCheckboxAll').on('change', function() {
        var $self = $(this),
            $checkboxes = $('.adminCheckboxRow');

        if($self.is(':checked')) {
            $checkboxes.not(':checked').each(function(i, a) {
                this.checked = true;
                $(this).trigger('change');
            });
        } else {
            $checkboxes.filter(':checked').each(function(i, a) {
                this.checked = false;
                $(this).trigger('change');
            });
        }
    });
});
$(function () {
    $(document).delegate('.btn-delete', 'click', function (e) {
        e.preventDefault();
        var form = $(this).closest('form');
        bootbox.confirm(window.Admin.Settings.lang.table['delete-confirm'], function (result) {
            if (result) {
                form.submit();
            }
        });
    });
    bootbox.setDefaults('locale', window.Admin.Settings.locale);
});
$(function () {
    $(document).delegate('*[data-toggle="lightbox"]', 'click', function (e) {
        e.preventDefault();
        $(this).ekkoLightbox({
            always_show_close: false
        });
    });
});
$(function () {
    $('.input-date').each(function () {
        var $self = $(this);
        $self.datetimepicker({
            locale: window.Admin.Settings.locale
        }).trigger('dp.change').on('dp.change', function () {
            $self.change();
        });
    });
});
$(function () {
    $('.input-select').each(function () {
        var options = {},
            $self = $(this);

        if ($self.hasClass('input-taggable')) {
            options['tags'] = true;
        }

        $self.select2(options)
    });
});
$(function () {
    $('.imageUpload').each(function (index, item) {
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
        flow.assignBrowse($item.find('.imageBrowse'), false, true);
        flow.on('filesSubmitted', function (file) {
            flow.upload();
        });
        flow.on('fileSuccess', function (file, message) {
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
        flow.on('fileError', function (file, message) {
            flow.removeFile(file);

            var response = $.parseJSON(message);
            var errors = '';
            $.each(response, function (index, error) {
                errors += '<p class="help-block">' + error + '</p>'
            });
            $errors.html(errors);
            $group.addClass('has-error');
        });
        $item.find('.imageRemove').click(function () {
            $input.val('');
            $noValue.removeClass('hidden');
            $hasValue.addClass('hidden');
        });
    });
});
$(function () {
    $('.imageUploadMultiple').each(function (index, item) {
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
        var updateValue = function () {
            var values = [];
            $item.find('img[data-value]').each(function () {
                values.push($(this).data('value'));
            });
            $input.val(values.join(','));
        };
        flow.assignBrowse($item.find('.imageBrowse'));
        flow.on('filesSubmitted', function (file) {
            flow.upload();
        });
        flow.on('fileSuccess', function (file, message) {
            flow.removeFile(file);

            $errors.html('');
            $group.removeClass('has-error');

            var result = $.parseJSON(message);

            $innerGroup.append($($('#thumbnail_template').html()).find('img').attr('src', result.url).attr('data-value', result.value));
            updateValue();
        });
        flow.on('fileError', function (file, message) {
            flow.removeFile(file);

            var response = $.parseJSON(message);
            var errors = '';
            $.each(response, function (index, error) {
                errors += '<p class="help-block">' + error + '</p>'
            });
            $errors.html(errors);
            $group.addClass('has-error');
        });
        $item.on('click', '.imageRemove', function (e) {
            e.preventDefault();
            $(this).closest('.imageThumbnail').remove();
            updateValue();
        });

        $innerGroup.sortable({
            onUpdate: function () {
                updateValue();
            }
        });
    });
});
window.Admin.Components
    .add('ckeditor', function() {
        switchOn_handler = function (textarea_id, params) {
            CKEDITOR.disableAutoInline = true;

            var params = $.extend({}, params);

            return CKEDITOR.replace(textarea_id, params);
        };

        switchOff_handler = function (editor, textarea_id) {
            editor.destroy()
        }

        exec_handler = function (editor, command, textarea_id, data) {
            switch (command) {
                case 'insert':
                    editor.insertText(data);
                    break;
                case 'changeHeight':
                    editor.resize('100%', data);
            }
        }

        window.Admin.WYSIWYG.add(
            'ckeditor',
            switchOn_handler,
            switchOff_handler,
            exec_handler
        );
    })
    .add('tinymce', function() {
        switchOn_handler = function (textarea_id, params) {
            var params = $.extend({
                selector:'#'+textarea_id
            }, params);


            return tinymce.init(params);
        };

        switchOff_handler = function (editor, textarea_id) {
            editor.destroy();
        }

        exec_handler = function (editor, command, textarea_id, data) {
            switch (command) {
                case 'insert':
                    editor.insertContent(data);
                    break;
            }
        }

        window.Admin.WYSIWYG.add(
            'tinymce',
            switchOn_handler,
            switchOff_handler,
            exec_handler
        );
    }).add('simplemde', function() {
        switchOn_handler = function (textarea_id, params) {
            var params = $.extend({
                element: $("#"+textarea_id)[0]
            }, params);


            return new SimpleMDE(params);
        };

        switchOff_handler = function (editor, textarea_id) {
            editor.destroy();
        }

        exec_handler = function (editor, command, textarea_id, data) {
            switch (command) {
                case 'insert':
                    editor.codemirror.replaceSelection(data);
                    break;
            }
        }

        window.Admin.WYSIWYG.add(
            'simplemde',
            switchOn_handler,
            switchOff_handler,
            exec_handler
        );
    });




$(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $('form[data-type="display-actions"]').on('submit', function(e) {
        var $form = $(this),
            $btn = $(e.target.action),
            $checkboxes = $('.adminCheckboxRow').filter(':checked');

        if (!$checkboxes.length) {
            e.preventDefault();
        }

        this.action = $btn.data('action');
        this.method = $btn.data('method');

        $checkboxes.each(function () {
            $form.append('<input type="hidden" name="id[]" value="' + $(this).val() + '" />');
        });
    });

    $('.inline-editable').editable();

    window.Admin.Components.init();
    window.Admin.Controllers.call();
});
//# sourceMappingURL=admin-default.js.map
