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
  <li class="nav-item has-treeview {!! ($isActive) ? 'menu-open' : '' !!}">
    <a href="#" {!! $linkAttributes !!}>
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
    <a href="{{ $url }}" {!! $linkAttributes !!}>
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
