<div class="sidebar">
    @stack('sidebar.top')

    <div class="brand">
      <a href="{{ url(config('sleeping_owl.url_prefix')) }}" class="brand-link">
        <span class="logo">
          {!! AdminTemplate::getLogo() !!}
        </span>

        <span class="logo-mini">
          {!! AdminTemplate::getLogoMini() !!}
        </span>

        @if (AdminTemplate::getMenuTop())
          <span class="brand-text font-weight-light">
            {!! AdminTemplate::getMenuTop() !!}
          </span>
        @endif
      </a>
    </div>

    <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            @stack('sidebar.ul.top')

            {!! $template->renderNavigation() !!}

            @stack('sidebar.ul.bottom')
        </ul>
    </nav>

    @stack('sidebar.bottom')
</div>
