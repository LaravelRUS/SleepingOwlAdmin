@php($mode = ($_COOKIE['theme-mode'] ?? 'light') === 'dark' ? 'dark' : 'light')
<ul class="nav navbar-nav soa-header-list">
	<li class="nav-item">
		<a class="nav-link soa-button soa-button-secondary soa-icon-button soa-header-action" data-widget="pushmenu" data-lte-toggle="sidebar" role="button" aria-label="Menu"><i class="fas fa-bars" aria-hidden="true"></i></a>
	</li>

	@if (config('sleeping_owl.datatables_settings.state_datatables') || config('sleeping_owl.datatables_settings.state_tabs') || config('sleeping_owl.datatables_settings.state_filters'))
		<li class="nav-item">
			<a class="nav-link soa-button soa-button-secondary soa-icon-button soa-header-action" href="javascript:localStorage.clear()" data-toggle="tooltip" data-bs-toggle="tooltip" title="{{ trans('sleeping_owl::lang.button.clear') }} LocalStorage" aria-label="{{ trans('sleeping_owl::lang.button.clear') }} LocalStorage">
				<i class="fas fa-eraser" aria-hidden="true"></i>
			</a>
		</li>
	@endif

	@if(config('sleeping_owl.ui.show_color_mode_toggle'))
		<li class="nav-item">
            <a class="nav-link soa-button soa-button-secondary soa-icon-button soa-header-action" data-mode="{{ $mode }}" id="theme-mode" data-toggle="tooltip" data-bs-toggle="tooltip" title="{{ trans('sleeping_owl::lang.button.theme') }}" aria-label="{{ trans('sleeping_owl::lang.button.theme') }}">
                @if($mode === 'light')
                    <i class="fa-solid fa-moon" id="theme-icon" aria-hidden="true"></i>
                @else
                    <i class="fa-regular fa-lightbulb" id="theme-icon" aria-hidden="true"></i>
                @endif
            </a>
        </li>
    @endif

	@stack('navbar.left')

	@stack('navbar')
</ul>

<ul class="navbar-nav ms-auto soa-header-list">
	@stack('navbar.right')
</ul>
