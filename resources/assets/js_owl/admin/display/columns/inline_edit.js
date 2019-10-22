Admin.Modules.register('display.columns.inline-edit', () => {
    $('.inline-editable').editable();

    $('.dt-editable, .dat-editable').editable({
      onblur:'ignore'
    });

    $('.dt-editable').on('shown', function(e, editable) {
      $('.datatime-editable').datetimepicker({
        locale: Admin.locale,
        format: Admin.Config.get('datetime_format'),
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
    });

    $('.dat-editable').on('shown', function(e, editable) {
      $('.date-editable').datetimepicker({
        locale: Admin.locale,
        format: Admin.Config.get('date_format'),
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
    });
}, 0, ['datatables::draw', 'bootstrap::tab::shown'])
