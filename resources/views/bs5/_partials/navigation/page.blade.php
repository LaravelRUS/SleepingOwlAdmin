@if($hasChild)
    <li class="sidebar-item is-submenu {!! ($isActive) ? 'show' : '' !!}">
        <a href="#" class="sidebar-link toggle-submenu" title="{{ strip_tags($title) }}">

            <span class="sidebar-title">
                <span class="sidebar-icon">
                    {!! $icon !!}
                </span>
                <span class="sidebar-text">
                    {!! $title !!}
                </span>

                @if($badges->count() > 0)
                    <span class="sidebar-page-badges">
                        @foreach($badges as $badge)
                            {!! $badge->render() !!}
                        @endforeach
                    </span>
                @endif
            </span>

            <span class="arrow-submenu">
                <i class="fa-solid fa-chevron-right"></i>
            </span>
        </a>

        <ul class="admin-submenu">
            @foreach($pages as $page)
                {!! $page->render() !!}
            @endforeach
        </ul>
    </li>
@else
    <li class="sidebar-item {!! ($isActive) ? 'active' : '' !!}">
        <a href="{{ $url }}" class="sidebar-link" title="{{ strip_tags($title) }}">
            <span>
                <span class="sidebar-icon">
                    @if($icon)
                        {!! $icon !!}
                    @else
                        <i class="fa-solid fa-minus no-sidebar-icon"></i>
                    @endif
                </span>

                <span class="sidebar-text">
                    {!! $title !!}
                </span>

                @if($badges->count() > 0)
                    <span class="sidebar-page-badges">
                        @foreach($badges as $badge)
                            {!! $badge->render() !!}
                        @endforeach
                    </span>
                @endif
            </span>
        </a>
    </li>
@endif
