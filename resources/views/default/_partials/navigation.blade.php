<div class="sidebar-brand soa-brand">
      <a href="{{ url(config('sleeping_owl.url_prefix')) }}" class="brand-link soa-brand-link">
        <span class="logo soa-brand-logo">
          {!! AdminTemplate::getLogo() !!}
        </span>

        <span class="logo-mini soa-brand-mini">
          {!! AdminTemplate::getLogoMini() !!}
        </span>

        @if (AdminTemplate::getMenuTop())
          <span class="brand-text fw-light soa-brand-text">
            {!! AdminTemplate::getMenuTop() !!}
          </span>
        @endif
      </a>
</div>

<div class="sidebar-wrapper soa-sidebar-scroll">
    @stack('sidebar.top')

    <nav class="mt-2 soa-sidebar-nav" aria-label="{{ strip_tags($template->getMenuTop() ?: config('sleeping_owl.ui.title')) }}">
        <ul class="nav nav-sidebar sidebar-menu flex-column soa-nav-tree" data-widget="treeview" data-lte-toggle="treeview" role="menu" data-accordion="false">
            @stack('sidebar.ul.top')

            {!! $template->renderNavigation() !!}

            @stack('sidebar.ul.bottom')
        </ul>
    </nav>

    @stack('sidebar.bottom')
</div>
