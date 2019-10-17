@stack('block.top')

<div class="row">
    <div class="col-md-3 col-sm-6 col-xs-12">
        @stack('block.top.column.left')
    </div>

    <div class="col-md-3 col-sm-6 col-xs-12">
        @stack('block.top.column.right')
    </div>
</div>

@stack('block.content')

<div class="row">
    <div class="col-md-8">
        @stack('block.content.column.left')
    </div>
    <div class="col-md-4">
        @stack('block.content.column.right')
    </div>
</div>

@stack('block.footer')
