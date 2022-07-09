@if($placements)
    @foreach($placements as $key => $val)
        @foreach($val as $section)
            @section(implode('.', [$key, $section]))
                <div {!! $attributes !!}>
                    <div class="btn-group" role="group">
                        @foreach($buttons as $button)
                            @if($button instanceof \SleepingOwl\Admin\Form\Buttons\FormButton && $button->canShow())
                                {!! $button->render() !!}
                            @endif
                        @endforeach
                    </div>
                </div>
            @endsection
        @endforeach
    @endforeach

<div {!! $attributes !!}>
    <div class="btn-group" role="group">
        @foreach($buttons as $button)
            @if($button instanceof \SleepingOwl\Admin\Form\Buttons\FormButton && $button->canShow())
                {!! $button->render() !!}
            @endif
        @endforeach
    </div>
</div>

@else
    <div {!! $attributes !!}>
        <div class="btn-group" role="group">
            @foreach($buttons as $button)
                @if($button instanceof \SleepingOwl\Admin\Form\Buttons\FormButton && $button->canShow())
                    {!! $button->render() !!}
                @endif
            @endforeach
        </div>
    </div>
@endif

