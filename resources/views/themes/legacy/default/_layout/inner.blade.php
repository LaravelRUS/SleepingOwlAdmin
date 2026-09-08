@extends(AdminTemplate::getViewPath('_layout.base'))

@section('content')
    <div class="app-wrapper" id="vueApp">

        <nav class="app-header navbar navbar-expand bg-body">
            @include(AdminTemplate::getViewPath('_partials.header'))
        </nav>

        <aside class="app-sidebar shadow" data-bs-theme="dark">
            @include(AdminTemplate::getViewPath('_partials.navigation'))
        </aside>

        <main class="app-main">

            <div class="app-content-header">
                <div class="container-fluid">
                    <div class="row mb-2 align-items-center">
                      <div class="col-sm-12">
                        {!! $template->renderBreadcrumbs($breadcrumbKey) !!}
                      </div>

                      <div class="col-sm-12">
                        <h1>
                          {!! $title !!}
                        </h1>
                      </div>
                    </div>
                </div>
            </div>

            <div class="app-content body">
                @stack('content.top')

                {!! $content !!}

                @stack('content.bottom')
            </div>
        </main>

        @php($assetHealthStatus = $assetHealthStatus ?? null)

        <footer class="app-footer main-footer small">
            @if(config('sleeping_owl.show_footer'))
                {!! config('sleeping_owl.footer_text') !!}

                @if(config('sleeping_owl.show_version'))
                    <div class="float-end d-none d-sm-inline-block">
                        {!! $template->getVersion() !!}
                    </div>
                @endif
            @endif

            @include(AdminTemplate::getViewPath('_partials.asset_health'), [
                'status' => $assetHealthStatus,
            ])
        </footer>

        <div id="sidebar-overlay"></div>
    </div>
@stop
