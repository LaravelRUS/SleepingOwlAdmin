Admin.Modules.register('form.elements.date', () => {
  $('.input-group.date').datetimepicker({
    locale: Admin.locale,
    format: 'L', //date only
    icons: {
      // time: "fas fa-clock",
      date: "far fa-calendar-alt",
      up: "fas fa-arrow-up",
      down: "fas fa-arrow-down"
    }
  });
})
