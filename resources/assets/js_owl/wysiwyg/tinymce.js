let switchOn_handler = (textareaId, params) => {
    return tinymce.init(
        _.extend({
            selector: '#' + textareaId
        }, params || {})
    )
}

let switchOff_handler = (editor, textareaId) => {
    editor.destroy()
}

let exec_handler = (editor, command, textareaId, data) => {
    switch (command) {
        case 'insert':
            editor.insertContent(data);
            break;
    }
}

Admin.WYSIWYG.register('tinymce', switchOn_handler, switchOff_handler, exec_handler);