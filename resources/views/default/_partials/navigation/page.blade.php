@php
  $tooltip = '';
  if (strlen (strip_tags($title)) > 15) {
    $tooltip = 'title="' . strip_tags($title) . '"';
  }
@endphp

@if($hasChild)
  <li class="nav-item has-treeview {!! ($isActive) ? 'menu-open' : '' !!}">
    <a href="#" class="nav-link" {!! $attributes !!} {!! $tooltip !!}>
      {!! $icon !!}
      <p class="{{ $icon ? 'ml-2':'' }}">
        {!! $title !!}
        <span class="pull-right-container">
          @if($badges->count() > 0)
            <span class="sidebar-page-badges">
              @foreach($badges as $badge)
                {!! $badge->render() !!}
              @endforeach
            </span>
          @endif
        </span>
        <i class="fas fa-angle-left right"></i>
      </p>
    </a>

    <ul class="nav nav-treeview">
      @foreach($pages as $page)
        {!! $page->render() !!}
      @endforeach
    </ul>
  </li>
@else
  <li class="nav-item">
    <a href="{{ $url }}" class="nav-link {!! ($isActive) ? 'active' : '' !!}" {!! $attributes !!} {!! $tooltip !!}>
      {!! $icon !!}
      <p class="{{ $icon ? 'ml-2':'' }}">
        {!! $title !!}
        @if($badges->count() > 0)
          <span class="pull-right-container">
            <span class="sidebar-page-badges">
              @foreach($badges as $badge)
                {!! $badge->render() !!}
              @endforeach
            </span>
          </span>
        @endif
      </p>
    </a>
  </li>
@endif
