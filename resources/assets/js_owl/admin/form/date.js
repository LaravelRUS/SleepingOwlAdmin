Admin.Modules.register('form.elements.date', () => {
  $('.input-group.date').datetimepicker({
    locale: Admin.locale,
    format: 'L', //date only
    icons: {
      // time: "fa fa-clock-o",
      date: "fa fa-calendar",
      up: "fa fa-arrow-up",
      down: "fa fa-arrow-down"
    }
  });
})
