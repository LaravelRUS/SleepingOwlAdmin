<ul class="nav navbar-nav soa-header-list">
    <li class="nav-item">
        @include('sleeping_owl_tailwind::components.ui.button', [
            'attributesArray' => [
                'aria-label' => 'Menu',
                'class' => 'nav-link',
                'data-lte-toggle' => 'sidebar',
                'data-widget' => 'pushmenu',
            ],
            'content' => '<i class="fas fa-bars" aria-hidden="true"></i>',
            'iconOnly' => true,
        ])
    </li>

    @if(config('sleeping_owl.datatables_settings.state_datatables') || config('sleeping_owl.state_tabs') || config('sleeping_owl.datatables_settings.state_filters'))
        <li class="nav-item">
            @include('sleeping_owl_tailwind::components.ui.button', [
                'attributesArray' => [
                    'aria-label' => trans('sleeping_owl::lang.button.clear').' LocalStorage',
                    'class' => 'nav-link',
                    'data-bs-toggle' => 'tooltip',
                    'data-toggle' => 'tooltip',
                    'href' => 'javascript:localStorage.clear()',
                    'title' => trans('sleeping_owl::lang.button.clear').' LocalStorage',
                ],
                'content' => '<i class="fas fa-eraser" aria-hidden="true"></i>',
                'element' => 'a',
                'iconOnly' => true,
            ])
        </li>
    @endif

    @if(config('sleeping_owl.show_mode'))
        @php($mode = ($_COOKIE['theme-mode'] ?? 'light') === 'dark' ? 'dark' : 'light')
        <li class="nav-item">
            @include('sleeping_owl_tailwind::components.ui.button', [
                'attributesArray' => [
                    'aria-label' => trans('sleeping_owl::lang.button.theme'),
                    'class' => 'nav-link',
                    'data-bs-toggle' => 'tooltip',
                    'data-mode' => $mode,
                    'data-toggle' => 'tooltip',
                    'id' => 'theme-mode',
                    'title' => trans('sleeping_owl::lang.button.theme'),
                ],
                'content' => $mode === 'light'
                    ? '<i class="fa-solid fa-moon" id="theme-icon" aria-hidden="true"></i>'
                    : '<i class="fa-regular fa-lightbulb" id="theme-icon" aria-hidden="true"></i>',
                'iconOnly' => true,
            ])
        </li>
    @endif

    @stack('navbar.left')
    @stack('navbar')
</ul>

<ul class="navbar-nav soa-header-list">
    @stack('navbar.right')
</ul>
