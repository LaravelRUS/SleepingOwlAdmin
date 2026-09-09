@if($messages)
    @include('sleeping_owl_tailwind::components.ui.alert', [
        'classes' => ['alert-info'],
        'iconClass' => 'fas fa-info fa-lg',
        'messages' => $messages,
    ])
    {{ session()->forget('info_message') }}
@endif
