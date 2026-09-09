@php
  $linkClasses = ['nav-link', 'soa-nav-link'];
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
  if ($plainTitle !== '' && !$linkAttributes->has('title')) {
    $linkAttributes = $linkAttributes->merge(['title' => $plainTitle]);
  }
  if ($hasChild) {
    $linkAttributes = $linkAttributes->merge([
      'aria-expanded' => $isActive ? 'true' : 'false',
      'aria-haspopup' => 'true',
    ]);
  }
@endphp

@if($hasChild)
  <li class="nav-item soa-nav-item {!! ($isActive) ? 'menu-open' : '' !!}">
    <a href="#" {!! $linkAttributes !!}>
      {!! $icon !!}
      <p class="soa-nav-link-content">
        <span class="soa-nav-title">{!! $title !!}</span>
        @if($badges->count() > 0)
          <span class="nav-badge sidebar-page-badges">
            @foreach($badges as $badge)
              {!! $badge->render() !!}
            @endforeach
          </span>
        @endif
        <i class="nav-arrow soa-nav-arrow fas fa-angle-right" aria-hidden="true"></i>
      </p>
    </a>

    @if($isActive)
    <ul class="nav nav-treeview soa-nav-children">
    @else
    <ul class="nav nav-treeview soa-nav-children" hidden>
    @endif
      @foreach($pages as $page)
        {!! $page->render() !!}
      @endforeach
    </ul>
  </li>
@else
  <li class="nav-item soa-nav-item">
    <a href="{{ $url }}" {!! $linkAttributes !!}>
      {!! $icon !!}
      <p class="soa-nav-link-content">
        <span class="soa-nav-title">{!! $title !!}</span>
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
