let switchOn_handler = (textareaId, params) => {
    CKEDITOR.disableAutoInline = true;

    return CKEDITOR.replace(textareaId, _.extend({}, params))
}

let switchOff_handler = (editor, textareaId) => {
    editor.destroy()
}

let exec_handler = (editor, command, textareaId, data) => {
    switch (command) {
        case 'insert':
            editor.insertText(data);
            break;
        case 'changeHeight':
            editor.resize('100%', data);
    }
}

Admin.WYSIWYG.register('ckeditor', switchOn_handler, switchOff_handler, exec_handler);