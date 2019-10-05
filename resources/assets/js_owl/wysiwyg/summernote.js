let switchOn_handler = (textareaId, params) => {
  $("#" + textareaId).summernote(
    params || {}
  );
}

let switchOff_handler = (editor, textareaId) => {
  $("#" + textareaId).summernote('destroy');
}

let exec_handler = (editor, command, textareaId, data) => {
}

Admin.WYSIWYG.register('summernote', switchOn_handler, switchOff_handler, exec_handler);
