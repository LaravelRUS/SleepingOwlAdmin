@if($hasChild)
<li {!! $attributes !!}>
    <a href="#" >
        {!! $icon !!}
        <span>{!! $title !!}</span>
        <i class="fa fa-angle-left pull-right-container"></i>
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
        {!! $badge !!}
    </a>
</li>
@endif
