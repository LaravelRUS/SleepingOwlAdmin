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