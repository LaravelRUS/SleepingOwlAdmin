@extends(AdminTemplate::getViewPath('_layout.base'))

@section('content')
    <div class="app-wrapper soa-app" id="vueApp">

        <nav class="app-header navbar navbar-expand bg-body soa-header">
            @include(AdminTemplate::getViewPath('_partials.header'))
        </nav>

        <aside class="app-sidebar main-sidebar shadow soa-sidebar" data-bs-theme="dark">
            @include(AdminTemplate::getViewPath('_partials.navigation'))
        </aside>

        <main class="app-main soa-main">

            <header class="app-content-header soa-page-heading">
                <div class="container-fluid soa-page-heading-inner">
                    <div class="row mb-2 align-items-center soa-page-heading-layout">
                      <div class="col-sm-12 soa-breadcrumb-region">
                        {!! $template->renderBreadcrumbs($breadcrumbKey) !!}
                      </div>

                      <div class="col-sm-12 soa-title-region">
                        <h1 class="soa-page-title">
                          {!! $title !!}
                        </h1>
                      </div>
                    </div>
                </div>
            </header>

            <div class="app-content body soa-content">
                @stack('content.top')

                {!! $content !!}

                @stack('content.bottom')
            </div>
        </main>

        @php($assetHealthStatus = $assetHealthStatus ?? null)

        <footer class="app-footer main-footer small soa-footer">
            <div class="soa-footer-inner">
                @if(config('sleeping_owl.ui.show_footer'))
                    <div class="soa-footer-copy">
                        <span>{!! config('sleeping_owl.ui.footer_text') !!}</span>

                        @if(config('sleeping_owl.ui.show_version'))
                            <span class="float-end d-none d-sm-inline-block soa-version">
                                {!! $template->getVersion() !!}
                            </span>
                        @endif
                    </div>
                @endif

                @include(AdminTemplate::getViewPath('_partials.asset_health'), [
                    'status' => $assetHealthStatus,
                ])
            </div>
        </footer>

        <div class="soa-sidebar-overlay" id="sidebar-overlay"></div>
    </div>
@stop
