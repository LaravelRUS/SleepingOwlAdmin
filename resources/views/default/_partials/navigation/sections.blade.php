@if(count($section) > 0 or $section->hasSections())
    <li class="mm-dropdown @if($section->isActive()) open @endif">
        <a href="#">
            {!! $section->getIcon() !!}
            <span class="mm-text">{!! $section->getName() !!}</span>
        </a>
        <ul>
            @foreach($section as $item)
                <?php if($item->isHidden()) continue; ?>
                <li @if ($item->isActive())class="active"@endif>
                    <a href="{{ $item->getUrl() }}">
                        {!! $item->getIcon() !!}
                        <span class="mm-text">{!! $item->getName() !!}</span>
                    </a>
                </li>
            @endforeach

            @foreach($section->getSections() as $sub_section )
            @include('cms::navigation.sections', ['section' => $sub_section])
            @endforeach
        </ul>
    </li>
@endif
