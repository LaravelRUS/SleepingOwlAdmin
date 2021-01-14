Admin.Modules.register('form.elements.wysiwyg', () => {
  $('textarea[data-wysiwyg-editor]').each(function () {
      let $this = $(this);
      if (!$this.attr('data-wysiwyg-inited')) {
          let wysiwyg_id = $this.attr('id');
          let wysiwyg_editor = $this.attr('data-wysiwyg-editor');
          let wysiwyg_parameters = JSON.parse($this.attr('data-wysiwyg-parameters')) || [];
          // console.log('Init wysiwyg: id=' + wysiwyg_id + ', editor_type=' + wysiwyg_editor + ', parameters:', wysiwyg_parameters);
          Admin.WYSIWYG.switchOn(wysiwyg_id, wysiwyg_editor, wysiwyg_parameters)
          $this.attr('data-wysiwyg-inited', 1);
      }
  });
})
