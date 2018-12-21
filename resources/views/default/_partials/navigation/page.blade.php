@if($hasChild)
<li class="nav-item has-treeview" {!! $attributes !!}>
    <a href="#" class="nav-link">
        {!! $icon !!}
        <p>{!! $title !!}</p>
        <i class="fa fa-angle-left pull-right"></i>
        {{-- <span class="pull-right-container">

            @if($badges->count() > 0)
            <span class="sidebar-page-badges">
            @foreach($badges as $badge)
                    {!! $badge->render() !!}
                @endforeach
            </span>
            @endif
        </span> --}}
    </a>

    <ul class="nav nav-treeview">
        @foreach($pages as $page)
           {!! $page->render() !!}
        @endforeach
    </ul>
</li>
@else
<li {!! $attributes !!} class="nav-item">
    <a href="{{ $url }}" class="nav-link">
        {!! $icon !!}
        <p>{!! $title !!}</p>

        {{-- @if($badges->count() > 0)
        <span class="pull-right-container">
            <span class="sidebar-page-badges">
            @foreach($badges as $badge)
                {!! $badge->render() !!}
            @endforeach
            </span>
        </span>
        @endif --}}
    </a>
</li>
@endif
