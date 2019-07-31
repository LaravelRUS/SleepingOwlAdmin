Admin.Modules.register('form.elements.daterange', () => {

  $('.input-group.input-daterange').datepicker({
    language: Admin.locale,
    clearBtn: true,
    autoclose: true,
    todayHighlight: true
  });

})
