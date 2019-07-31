Admin.Modules.register('form.elements.datetime', () => {
  $('.input-group.datetime').datetimepicker({
    locale: Admin.locale,
    icons: {
      time: "fa fa-clock-o",
      date: "fa fa-calendar",
      up: "fa fa-arrow-up",
      down: "fa fa-arrow-down"
    }
  });

})


// OLD variant
// Admin.Modules.register('form.elements.datetime', () => {
//   $('.input-group.datetime').each((i, item) => {
//     let $self = $(item);
//
//     $self.datetimepicker({
//       locale: Admin.locale,
//       icons: {
//         time: "fa fa-clock-o",
//         date: "fa fa-calendar",
//         up: "fa fa-arrow-up",
//         down: "fa fa-arrow-down"
//       }
//     }).on('dp.change', () => {
//       $self.change()
//     })
//   })
// })
