@if($hasChild)
<li {!! $attributes !!}>
    <a href="#" >
        {!! $icon !!}
        <span>{!! $title !!}</span>
        <span class="pull-right-container">
            <i class="fa fa-angle-left pull-right"></i>

            @if($badges->count() > 0)
            <span class="sidebar-page-badges">
            @foreach($badges as $badge)
                    {!! $badge->render() !!}
                @endforeach
            </span>
            @endif
        </span>
    </a>

    <ul class="treeview-menu">
        @foreach($pages as $page)
           {!! $page->render() !!}
        @endforeach
    </ul>
</li>
@else
<li {!! $attributes !!}>
    <a href="{{ $url }}">
        {!! $icon !!}
        <span>{!! $title !!}</span>

        @if($badges->count() > 0)
        <span class="pull-right-container">
            <span class="sidebar-page-badges">
            @foreach($badges as $badge)
                {!! $badge->render() !!}
            @endforeach
            </span>
        </span>    
        @endif
    </a>
</li>
@endif
