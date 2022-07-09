@extends(AdminTemplate::getViewPath('_layout.base'))

@section('content')

    <div class="wrapper" id="vueApp">

        @include(AdminTemplate::getViewPath('_partials.navigation'))

        <main>
            @include(AdminTemplate::getViewPath('_partials.header'))

            <div id="main-body" class="container">
                <header class="row">
                    {{-- Breadcrumbs --}}
                    <div class="col-12">
                        {!! $template->renderBreadcrumbs($breadcrumbKey) !!}
                    </div>

                    {{-- Header --}}
                    <div class="col-12">
                        <h1>
                            {!! $title !!}
                        </h1>
                    </div>
                </header>

                <div class="content body">
                    @stack('content.top')

                    {!! $content !!}

                    @stack('content.bottom')

                </div>

                @include(AdminTemplate::getViewPath('helper.scrolltotop'))
            </div>
        </main>

    </div>
@stop
