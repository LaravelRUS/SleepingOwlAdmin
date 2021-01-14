Admin.Modules.register('form.elements.daterange', () => {
  // TODO Need for tests and improvements
  let selector = '.input-group.daterange, .input-group .input-daterange';
  let date_format = Admin.Config.get('date_format') || 'DD.MM.YYYY';
  $(selector).each(function () {
    let $this = $(this);

    // Do not init one element twice
    if ($this.attr('data-daterangepicker-inited')) {
      return;
    }

    // Init DateRangePicker
    $this.daterangepicker({
      // Base options
      autoUpdateInput: false, // We will update the input manually on range changed
      timePicker: false, // Only date range, without time. Need to research & testing for allow this feature
      // Custom options
      autoApply: $this.attr('data-auto-apply') === 'true', // Show or hide Apply/Cancel buttons
      startDate : $this.attr('data-start-date') || (new Date()),
      endDate : $this.attr('data-end-date') || (new Date()),
      minDate : $this.attr('data-min-date') || false,
      maxDate : $this.attr('data-max-date') || false,
      maxSpan : (function () {
        try {
          return JSON.parse($this.attr('data-max-span'));
        } catch(e) {
          return false;
        }
      })(),
      opens : $this.attr('data-opens') || 'right',
      drops : $this.attr('data-drops') || 'auto',
      // Locale options
      locale: {
        format: date_format,
        separator: ' - ',
        applyLabel: trans('lang.select.init'),
        cancelLabel: trans('lang.button.cancel'),
      },
    });

    // Date range: on change event
    $this.on('apply.daterangepicker', function (event, picker) {
      let $input = $(this);
      // console.log(event);
      // console.log(picker);
      // console.log($input);

      // let format = 'YYYY-MM-DD';
      let format = picker.locale.format;
      let startdate = picker.startDate.format(format);
      let enddate = picker.endDate.format(format);
      let value = startdate + picker.locale.separator + enddate;
      // console.log(value);

      $input.val(value).trigger('change');
    });

    // Set mark of the successful initialization to the element
    $this.attr('data-daterangepicker-inited', 'true');
  });
})
