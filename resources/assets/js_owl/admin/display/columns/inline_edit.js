Admin.Modules.register('display.columns.inline-edit', () => {
    //AdminColumnEditable

    $('.inline-editable').editable({
      success: function(response, newValue) {
        if(response.status !== 'true' && response.status !== true) {
          return response.reason || trans('lang.table.error');
        } else if (response.newValue !== undefined) {
          return {newValue: response.newValue};
        }
      },
      error: function(response, newValue) {
        if(response.status === 500) {
          return trans('lang.table.error');
        } else {
          return response.responseText;
        }
      }
    });

    $('.dt-editable, .dat-editable').editable({
      onblur:'ignore',
      error: function(response, newValue) {
        if(response.status === 500) {
          return trans('lang.table.error');
        } else {
          return response.responseText;
        }
      }
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
