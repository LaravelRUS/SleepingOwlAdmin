@php
  $linkClasses = ['nav-link'];
  $activeClass = config('navigation.class.active', 'active');
  $hasChildClass = config('navigation.class.has_child', 'has-child');
  $treeviewClass = config('navigation.class.has_child', 'treeview');

  if ($isActive && $activeClass) {
    $linkClasses[] = $activeClass;
  }
  if ($hasChild && $hasChildClass) {
    $linkClasses[] = $hasChildClass;
  }
  if ($hasChild && $treeviewClass && $treeviewClass !== $hasChildClass) {
    $linkClasses[] = $treeviewClass;
  }

  $linkAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))->class($linkClasses);
  $plainTitle = strip_tags($title);
  if (strlen($plainTitle) > 15 && !$linkAttributes->has('title')) {
    $linkAttributes = $linkAttributes->merge(['title' => $plainTitle]);
  }
@endphp

@if($hasChild)
  <li class="nav-item {!! ($isActive) ? 'menu-open' : '' !!}">
    <a href="#" {!! $linkAttributes !!}>
      {!! $icon !!}
      <p>
        {!! $title !!}
        <span class="nav-badge sidebar-page-badges">
          @if($badges->count() > 0)
            <span class="sidebar-page-badges">
              @foreach($badges as $badge)
                {!! $badge->render() !!}
              @endforeach
            </span>
          @endif
        </span>
        <i class="nav-arrow fas fa-angle-right"></i>
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
    <a href="{{ $url }}" {!! $linkAttributes !!}>
      {!! $icon !!}
      <p>
        {!! $title !!}
        @if($badges->count() > 0)
          <span class="nav-badge sidebar-page-badges">
              @foreach($badges as $badge)
                {!! $badge->render() !!}
              @endforeach
          </span>
        @endif
      </p>
    </a>
  </li>
@endif
