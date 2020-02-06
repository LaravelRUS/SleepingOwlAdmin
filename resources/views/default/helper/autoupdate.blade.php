@php
  $autoupdate_enable = config('sleeping_owl.dt_autoupdate');

  $autoupdate_timer0 = (int) config('sleeping_owl.dt_autoupdate_interval');
  !$autoupdate_timer0 >= 1 ? $autoupdate_timer0 = 5 : '';
  $autoupdate_timer = $autoupdate_timer0 * 1000 * 60;

  $autoupdate_class = config('sleeping_owl.dt_autoupdate_class');
  $autoupdate_class ? $autoupdate_class = '.datatables.' . $autoupdate_class : $autoupdate_class = '.datatables';

  $autoupdate_color = config('sleeping_owl.dt_autoupdate_color');
  !$autoupdate_color ? $autoupdate_color = '#dc3545': '';
@endphp

@if ($autoupdate_enable)

  <script type="text/javascript">
    $(window).on('load', () => {
      if ($('table').hasClass('datatables')) {

      var bar = new ProgressBar.Line('.datatables', {
        strokeWidth: 2,
        duration: {{ $autoupdate_timer }},
        color: '{{ $autoupdate_color }}',
        svgStyle: null
      });

      if(document.querySelectorAll("{{ $autoupdate_class }}").length) {
        $('{{ $autoupdate_class }}').addClass('autoupdater');
        $('{{ $autoupdate_class }}').append('<span class="autoupdater-close">&times;</span>');

        bar.animate(1.0);
        progressbar = setTimeout(autoupdate, {{ $autoupdate_timer }})
        console.log('Autoupdate dataTables: ' + {{ $autoupdate_timer0 }} + ' min.');
        stop = 0;

        function autoupdate() {
          bar.set(0);

          if (stop) {
            clearTimeout(progressbar);
            return false;
          }

          bar.animate(1.0);
          progressbar = setTimeout(autoupdate, {{ $autoupdate_timer }});
          $('.datatables').DataTable().draw();
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
