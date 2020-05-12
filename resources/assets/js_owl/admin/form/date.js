Admin.Modules.register('form.elements.date', () => {
  $('.input-group.date').datetimepicker({
    locale: Admin.locale,
    format: 'L', //date only
    // debug: true,
    icons: {
      time: "fas fa-clock",
      date: "far fa-calendar-alt",
      up: "fas fa-arrow-up",
      down: "fas fa-arrow-down",
      previous: 'fas fa-arrow-left',
      next: 'fas fa-arrow-right',
      today: 'fas fa-calendar-week',
      clear: 'far fa-calendar-times',
      close: 'fas fa-times'
    }
  });
})
