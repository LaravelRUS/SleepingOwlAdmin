<div class="sidebar-brand">
      <a href="{{ url(config('sleeping_owl.url_prefix')) }}" class="brand-link">
        <span class="logo">
          {!! AdminTemplate::getLogo() !!}
        </span>

        <span class="logo-mini">
          {!! AdminTemplate::getLogoMini() !!}
        </span>

        @if (AdminTemplate::getMenuTop())
          <span class="brand-text fw-light">
            {!! AdminTemplate::getMenuTop() !!}
          </span>
        @endif
      </a>
</div>

<div class="sidebar-wrapper">
    @stack('sidebar.top')

    <nav class="mt-2">
        <ul class="nav sidebar-menu flex-column" data-widget="treeview" data-lte-toggle="treeview" role="menu" data-accordion="false">
            @stack('sidebar.ul.top')

            {!! $template->renderNavigation() !!}

            @stack('sidebar.ul.bottom')
        </ul>
    </nav>

    @stack('sidebar.bottom')
</div>
