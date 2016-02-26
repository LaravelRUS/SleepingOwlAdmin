@if($hasChild)
<li class="treeview @if($isActive) active @endif">
    <a href="#">
        {!! $icon !!}
        <span>{!! $title !!}</span>
        <i class="fa fa-angle-left pull-right"></i>
    </a>

    <ul class="treeview-menu">
        @foreach($pages as $page)
           {!! $page->render() !!}
        @endforeach
    </ul>
</li>
@else
<li @if($isActive) class="active" @endif>
    <a href="{{ $url }}">
        {!! $icon !!}
        <span>{!! $title !!}</span>
    </a>
</li>
@endif