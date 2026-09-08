@if($messages)
    @php
        $alertAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
            ->class(['alert', 'alert-message', 'soa-alert', ...($classes ?? [])])
            ->merge(['role' => ($role ?? 'status')]);
    @endphp

    <div {!! $alertAttributes !!}>
        <i class="soa-alert-icon {{ $iconClass }}" aria-hidden="true"></i>
        <div class="soa-alert-content">{!! $messages !!}</div>
        @include('sleeping_owl_tailwind::components.ui.button', [
            'attributesArray' => [
                'aria-label' => 'Close',
                'class' => 'soa-alert-dismiss',
                'data-bs-dismiss' => 'alert',
                'data-dismiss' => 'alert',
            ],
            'content' => '<i class="fas fa-xmark" aria-hidden="true"></i>',
            'iconOnly' => true,
        ])
    </div>
@endif
