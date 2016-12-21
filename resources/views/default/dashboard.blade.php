@yield('block.top')

<div class="row">
    <div class="col-md-3 col-sm-6 col-xs-12">
        @yield('block.top.column.left')
    </div>

    <div class="col-md-3 col-sm-6 col-xs-12">
        @yield('block.top.column.right')
    </div>
</div>

@yield('block.content')

<div class="row">
    <div class="col-md-8">
        @yield('block.content.column.left')
    </div>
    <div class="col-md-4">
        @yield('block.content.column.right')
    </div>
</div>

@yield('block.footer')