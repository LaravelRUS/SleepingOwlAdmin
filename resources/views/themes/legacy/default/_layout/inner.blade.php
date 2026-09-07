@extends(AdminTemplate::getViewPath('_layout.base'))

@section('content')
    <div class="wrapper" id="vueApp">

        <nav class="main-header navbar navbar-expand border-bottom">
            @include(AdminTemplate::getViewPath('_partials.header'))
        </nav>

        <aside class="main-sidebar sidebar-dark-primary elevation-4">
            @include(AdminTemplate::getViewPath('_partials.navigation'))
        </aside>

        <div class="content-wrapper">

            <div class="content-header">
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

            <div class="content body">
                @stack('content.top')

                {!! $content !!}

                @stack('content.bottom')
            </div>
        </div>

        @php($assetHealthStatus = $assetHealthStatus ?? null)

        @if(config('sleeping_owl.show_footer') || $assetHealthStatus)
            <footer class="main-footer small">
                @if(config('sleeping_owl.show_footer'))
                    {!! config('sleeping_owl.footer_text') !!}

                    @if(config('sleeping_owl.show_version'))
                        <div class="float-right d-none d-sm-inline-block">
                            {!! $template->getVersion() !!}
                        </div>
                    @endif
                @endif

                @include(AdminTemplate::getViewPath('_partials.asset_health'), [
                    'status' => $assetHealthStatus,
                ])
            </footer>
        @endif

        <div id="sidebar-overlay"></div>
    </div>
@stop
