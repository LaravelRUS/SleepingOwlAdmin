<nav class="mt-2">
    <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
        @foreach($pages as $page)
            {!! $page->render() !!}
        @endforeach
    </ul>
</nav>
