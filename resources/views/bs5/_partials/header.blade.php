<header id="adminNavbar" class="admin-navbar">
    <div class="sidebar-control">
        <div class="main-logo">
            <a class="nav_logo" href="{{ url(config('sleeping_owl.url_prefix')) }}">
                    <span class="logo">
                        {!! AdminTemplate::getLogoMini() !!}
                    </span>
            </a>
        </div>

        <button type="button" id="navbar-toggle" class="navbar-toggle" aria-label="Toggle navigation">
            <i class="fa-solid fa-bars"></i>
        </button>

        <button type="button" id="navbar-toggle-mobile" class="navbar-toggle" aria-label="Toggle navigation">
            <i class="fa-solid fa-bars"></i>
        </button>

        @if (
            config('sleeping_owl.state_datatables') ||
            config('sleeping_owl.state_tabs') ||
            config('sleeping_owl.state_filters')
        )
            <button id="clear-local-storage" class="navbar-toggle"
                    data-toggle="tooltip"
                    title="{{ trans('sleeping_owl::lang.button.clear') }} LocalStorage"
            >
                <i class="fas fa-eraser"></i>
            </button>
        @endif
    </div>

    @stack('navbar.left')

    @stack('navbar')

{{--    @stack('navbar.right')--}}

</header>

