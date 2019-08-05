Admin.Modules.register('form.elements.datetime', () => {
  $('.input-group.datetime').datetimepicker({
    locale: Admin.locale,
    icons: {
      time: "fas fa-clock",
      date: "far fa-calendar-alt",
      up: "fas fa-arrow-up",
      down: "fas fa-arrow-down"
    }
  });

})
