<div class="sidebar">
    @stack('sidebar.top')

    <a href="{{ url(config('sleeping_owl.url_prefix')) }}" class="brand-link text-center">
        {!! AdminTemplate::getLogo() !!}
    </a>

    <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            @stack('sidebar.ul.top')

            {!! $template->renderNavigation() !!}

            @stack('sidebar.ul.bottom')
        </ul>
    </nav>

    @stack('sidebar.bottom')
</div>
