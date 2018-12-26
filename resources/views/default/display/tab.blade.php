<a class="nav-item nav-link {!! ($active) ? 'active' : '' !!}" data-toggle="tab" href="#nav-{{ $name }}" aria-selected="true" aria-controls="nav-{{ $name }}" {!! $attributes !!}>
  {{-- ##fix## setHtmlAttribute не работает на добавление классов (только role="tab") --}}
  @if($icon)
      {!! $icon !!}
  @endif

  {{ $label }}
  @if($badge)
      {!! $badge->render() !!}
  @endif
</a>
