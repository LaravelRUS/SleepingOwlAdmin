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

        <button type="button" id="sidebar-toggle-mobile" class="navbar-toggle" aria-label="Toggle navigation">
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>

    @stack('sidebar.ul.top')

    <nav class="admin-sidebar-menu">
            {!! $template->renderNavigation() !!}


{{--        <li class="sidebar-item is-submenu">--}}
{{--            <a href="#" class="sidebar-link toggle-submenu">--}}
{{--                <span class="sidebar-title">--}}
{{--                    <span class="sidebar-icon">--}}
{{--                        <i class="fa-solid fa-gauge-simple-high"></i>--}}
{{--                    </span>--}}

{{--                    <span class="sidebar-text">--}}
{{--                        Dashboard--}}
{{--                    </span>--}}
{{--                </span>--}}

{{--                <span class="arrow-submenu">--}}
{{--                    <i class="fa-solid fa-chevron-right"></i>--}}
{{--                </span>--}}
{{--            </a>--}}

{{--            <ul class="admin-submenu">--}}
{{--                <li class="sidebar-item">--}}
{{--                    <a href="#" class="sidebar-link">--}}
{{--                        <span>--}}
{{--                            <span class="sidebar-icon">--}}
{{--                                <i class="fa-solid fa-building-circle-arrow-right"></i>--}}
{{--                            </span>--}}

{{--                            <span class="sidebar-text">--}}
{{--                                Level 1--}}
{{--                            </span>--}}
{{--                        </span>--}}
{{--                    </a>--}}
{{--                </li>--}}

{{--                <li class="sidebar-item">--}}
{{--                    <a href="#" class="sidebar-link">--}}
{{--                        <span>--}}
{{--                            <span class="sidebar-icon">--}}
{{--                                <i class="fa-solid fa-shapes"></i>--}}
{{--                            </span>--}}

{{--                            <span class="sidebar-text">--}}
{{--                                Level 2--}}
{{--                            </span>--}}
{{--                        </span>--}}
{{--                    </a>--}}
{{--                </li>--}}
{{--            </ul>--}}
{{--        </li>--}}

{{--        <li class="sidebar-item sidebar-label">--}}
{{--            <div class="sidebar-link">--}}
{{--                <span class="sidebar-ellipsis">--}}
{{--                    <i class="fa-solid fa-ellipsis"></i>--}}
{{--                </span>--}}
{{--                <span class="sidebar-text">--}}
{{--                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias amet, animi aut commodi deleniti ea excepturi explicabo hic impedit incidunt inventore libero molestias odio quos rerum sed tenetur totam vel.--}}
{{--                </span>--}}
{{--            </div>--}}
{{--        </li>--}}

{{--        <li class="sidebar-item is-submenu">--}}
{{--            <a href="#" class="sidebar-link">--}}
{{--                    <span class="sidebar-title">--}}
{{--                        <span class="sidebar-icon">--}}
{{--                            <i class="fa-solid fa-circle-nodes"></i>--}}
{{--                        </span>--}}

{{--                        <span class="sidebar-text">--}}
{{--                            Text <i class="fa-brands fa-affiliatetheme"></i> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum cupiditate debitis deserunt dolor eligendi facere ipsam, magnam magni nam necessitatibus nisi obcaecati optio quibusdam quo suscipit, temporibus unde veritatis vero?--}}
{{--                        </span>--}}
{{--                    </span>--}}

{{--                <span class="arrow-submenu">--}}
{{--                    <i class="fa-solid fa-chevron-right"></i>--}}
{{--                </span>--}}
{{--            </a>--}}
{{--        </li>--}}

        <li role="separator" class="sidebar-divider"></li>

        <li class="sidebar-item sidebar-label">
            <div class="sidebar-link">
                <span class="sidebar-ellipsis">
                    <i class="fa-solid fa-ellipsis"></i>
                </span>
                <span class="sidebar-text">
                    Label
                </span>
            </div>
        </li>


{{--        @for($i = 0; $i < 20; $i++)--}}
{{--            <li class="sidebar-item">--}}
{{--                <a href="#" class="sidebar-link">--}}
{{--                    <span>--}}
{{--                        <span class="sidebar-icon">--}}
{{--                            <i class="fa-solid fa-circle-dot"></i>--}}
{{--                        </span>--}}

{{--                        <span class="sidebar-text">--}}
{{--                            Info {{ $i }}--}}
{{--                        </span>--}}
{{--                    </span>--}}
{{--                </a>--}}
{{--            </li>--}}
{{--        @endfor--}}

        <li class="sidebar-item">
            <a href="#" class="sidebar-link">
                    <span>
                        <span class="sidebar-icon">
                            <i class="fa-solid fa-person-circle-check"></i>
                        </span>

                        <span class="sidebar-text">
                            Settings
                        </span>
                    </span>
            </a>
        </li>



    </nav>
        @stack('sidebar.ul.bottom')

</div>

<main>
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

            <button id="clear-local-storage" class="navbar-toggle" data-toggle="tooltip" title="{{ trans('sleeping_owl::lang.button.clear') }} LocalStorage">
                <i class="fas fa-eraser"></i>
            </button>
        </div>

    </header>

    <div id="main-body" class="container">
        <h1 class="text-3xl font-bold underline">
            Hello world!
        </h1>

        @for($i = 0; $i < 20; $i++)
            <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto ex facilis iste provident voluptatem. Aliquam amet, consectetur consequuntur facere fuga, illum iusto molestias, perspiciatis placeat quaerat qui quia vero voluptates!
            </p>
        @endfor
    </div>
</main>



