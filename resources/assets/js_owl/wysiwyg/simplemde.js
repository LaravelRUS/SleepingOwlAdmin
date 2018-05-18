let switchOn_handler = (textareaId, params) => {
    return new SimpleMDE(
        _.extend({
            element: $("#" + textareaId)[0]
        }, params || {})
    );
}

let switchOff_handler = (editor, textareaId) => {
    editor.destroy()
}

let exec_handler = (editor, command, textareaId, data) => {
    switch (command) {
        case 'insert':
            editor.codemirror.replaceSelection(data);
            break;
    }
}

Admin.WYSIWYG.register('simplemde', switchOn_handler, switchOff_handler, exec_handler);