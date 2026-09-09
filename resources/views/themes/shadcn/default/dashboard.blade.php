@stack('block.top')

<div class="row soa-dashboard-grid soa-dashboard-grid-top">
    <div class="col-md-3 col-sm-6 col-xs-12 soa-dashboard-column soa-dashboard-column-quarter">
        @stack('block.top.column.left')
    </div>

    <div class="col-md-3 col-sm-6 col-xs-12 soa-dashboard-column soa-dashboard-column-quarter">
        @stack('block.top.column.right')
    </div>
</div>

@stack('block.content')

<div class="row soa-dashboard-grid soa-dashboard-grid-content">
    <div class="col-md-8 soa-dashboard-column soa-dashboard-column-wide">
        @stack('block.content.column.left')
    </div>
    <div class="col-md-4 soa-dashboard-column soa-dashboard-column-narrow">
        @stack('block.content.column.right')
    </div>
</div>

@stack('block.footer')
