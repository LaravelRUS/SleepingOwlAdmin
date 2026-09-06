@php
  $autoupdate = app(\SleepingOwl\Admin\Configuration\DataTablesAutoUpdateConfiguration::class);
@endphp

@if ($autoupdate->enabled())

  <script type="text/javascript">
    $(window).on('load', () => {
      if ($('table').hasClass('datatables')) {

      const autoupdateSelector = {{ \Illuminate\Support\Js::from($autoupdate->tableSelector()) }};

      var bar = new ProgressBar.Line('.datatables', {
        strokeWidth: 2,
        duration: {{ $autoupdate->intervalMilliseconds() }},
        color: {{ \Illuminate\Support\Js::from($autoupdate->color()) }},
        svgStyle: null
      });

      if(document.querySelectorAll(autoupdateSelector).length) {
        $(autoupdateSelector).addClass('autoupdater');
        $(autoupdateSelector).append('<span class="autoupdater-close">&times;</span>');

        bar.animate(1.0);
        progressbar = setTimeout(autoupdate, {{ $autoupdate->intervalMilliseconds() }})
        console.log('Autoupdate dataTables: ' + {{ $autoupdate->intervalMinutes() }} + ' min.');
        stop = 0;

        function autoupdate() {
          bar.set(0);

          if (stop) {
            clearTimeout(progressbar);
            return false;
          }

          bar.animate(1.0);
          progressbar = setTimeout(autoupdate, {{ $autoupdate->intervalMilliseconds() }});
          document.querySelectorAll(autoupdateSelector).forEach((table) => {
            Admin.Tables.reload(table);
          });
        }
      }

      $('.autoupdater-close').on('click', function() {
        bar.set(0);
        stop = 1;
        $('.autoupdater-close').remove();
        console.log('Stop autoupdate');
      })
    }
    });
  </script>
@endif
