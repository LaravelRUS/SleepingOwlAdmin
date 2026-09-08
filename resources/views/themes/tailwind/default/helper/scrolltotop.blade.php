@if(config('sleeping_owl.scroll_to_top'))
    <a class="soa-scroll-control" id="scrolltotop" href="#vueApp" aria-label="Scroll to top">
        <i class="fas fa-angle-double-up" aria-hidden="true"></i>
    </a>
@endif

@if(config('sleeping_owl.scroll_to_bottom'))
    <a class="soa-scroll-control" id="scrolltobottom" href="#page-end" aria-label="Scroll to bottom">
        <i class="fas fa-angle-double-down" aria-hidden="true"></i>
    </a>
    <span id="page-end"></span>
@endif
