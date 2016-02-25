@if(count($section) > 0 or $section->hasSections())
    <li class="treeview">
        <a href="#">
            {!! $section->getIcon() !!}
            <span>{!! $section->getName() !!}</span>
            <i class="fa fa-angle-left pull-right"></i>
        </a>
        <ul class="treeview-menu">
            @foreach($section as $item)
                <?php if($item->isHidden()) continue; ?>
                <li @if ($item->isActive())class="active"@endif>
                    <a href="{{ $item->getUrl() }}">
                        {!! $item->getIcon() !!}
                        {!! $item->getName() !!}
                    </a>
                </li>
            @endforeach

            @foreach($section->getSections() as $sub_section )
            @include(AdminTemplate::getViewPath('_partials.navigation.sections'), ['section' => $sub_section])
            @endforeach
        </ul>
    </li>
@endif
