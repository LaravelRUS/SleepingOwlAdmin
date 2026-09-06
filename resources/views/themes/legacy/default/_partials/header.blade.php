<ul class="nav navbar-nav ">
	<li class="nav-item">
		<a class="nav-link" data-widget="pushmenu"><i class="fas fa-bars"></i></a>
	</li>

	@if (config('sleeping_owl.state_datatables') || config('sleeping_owl.state_tabs') || config('sleeping_owl.state_filters'))
		<li class="nav-item">
			<a class="nav-link" href="javascript:localStorage.clear()" data-toggle="tooltip" title="{{ trans('sleeping_owl::lang.button.clear') }} LocalStorage">
				<i class="fas fa-eraser"></i>
			</a>
		</li>
	@endif

    @if(config('sleeping_owl.show_mode'))
        <li>
            <a class="nav-link" data-mode="{{ @$_COOKIE['theme-mode'] ?? 'light' }}" id="theme-mode" data-toggle="tooltip" title="{{ trans('sleeping_owl::lang.button.theme') }}">
                @if((@$_COOKIE['theme-mode'] ?? 'light') == 'light')
                    <i class="fa-solid fa-moon" id="theme-icon"></i>
                @else
                    <i class="fa-regular fa-lightbulb" id="theme-icon"></i>
                @endif
            </a>
        </li>
    @endif

	@stack('navbar.left')

	@stack('navbar')
</ul>

<ul class="navbar-nav ml-auto">
	@stack('navbar.right')
</ul>
