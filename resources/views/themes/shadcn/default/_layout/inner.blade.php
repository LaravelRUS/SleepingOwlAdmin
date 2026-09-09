@extends(AdminTemplate::getViewPath('_layout.base'))

@section('content')
    <div class="app-wrapper soa-app" id="vueApp">
        <header class="app-header soa-header">
            @include(AdminTemplate::getViewPath('_partials.header'))
        </header>

        <aside class="app-sidebar main-sidebar soa-sidebar">
            @include(AdminTemplate::getViewPath('_partials.navigation'))
        </aside>

        <main class="app-main soa-main">
            <header class="app-content-header soa-page-heading">
                {!! $template->renderBreadcrumbs($breadcrumbKey) !!}
                <h1 class="soa-page-title">{!! $title !!}</h1>
            </header>

            <div class="app-content body soa-content">
                @stack('content.top')
                {!! $content !!}
                @stack('content.bottom')
            </div>
        </main>

        @php($assetHealthStatus = $assetHealthStatus ?? null)
        <footer class="app-footer main-footer soa-footer">
            <div class="soa-footer-inner">
                @if(config('sleeping_owl.ui.show_footer'))
                    <div class="soa-footer-copy">
                        <span>{!! config('sleeping_owl.ui.footer_text') !!}</span>

                        @if(config('sleeping_owl.ui.show_version'))
                            <span class="soa-version">{!! $template->getVersion() !!}</span>
                        @endif
                    </div>
                @endif

                @include(AdminTemplate::getViewPath('_partials.asset_health'), [
                    'status' => $assetHealthStatus,
                ])
            </div>
        </footer>

        <div id="sidebar-overlay"></div>
    </div>
@stop
