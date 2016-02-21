@if(count($section) > 0 or $section->hasSections())
    <li>
        <a href="#">
            {!! $section->getIcon() !!}
            {!! $section->getName() !!}
            <span class="fa arrow"></span>
        </a>
        <ul class="nav nav-second-level">
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
            @include(AdminTemplate::getTemplateViewPath('_partials.navigation.sections'), ['section' => $sub_section])
            @endforeach
        </ul>
    </li>
@endif
