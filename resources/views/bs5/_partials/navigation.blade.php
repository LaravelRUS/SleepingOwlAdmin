<div id="adminSidebar" class="admin-sidebar {{ @$_COOKIE['sidebar-state'] == 'sidebar-collapse' ? ' collapsed' : '' }}">
    <div class="sidebar-header">
        <a class="nav_logo" href="{{ url(config('sleeping_owl.url_prefix')) }}">
            <span class="logo logo-mini">
                {!! AdminTemplate::getLogoMini() !!}
            </span>
            <span class="logo logo-full">
                {!! AdminTemplate::getLogo() !!}
            </span>
        </a>

        @if (AdminTemplate::getMenuTop())
            <div class="sidebar-topmenu-text">
                {!! AdminTemplate::getMenuTop() !!}
            </div>
        @endif

        <button type="button" id="sidebar-toggle-mobile" class="navbar-toggle" aria-label="Toggle navigation">
            <i class="fa-solid fa-xmark"></i>
        </button>

    </div>

    @stack('sidebar.ul.top')

    <nav class="admin-sidebar-menu">
        {!! $template->renderNavigation() !!}
    </nav>

    @stack('sidebar.ul.bottom')

</div>
