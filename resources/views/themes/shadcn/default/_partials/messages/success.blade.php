@if($messages)
    @include('sleeping_owl_tailwind::components.ui.alert', [
        'classes' => ['alert-success'],
        'iconClass' => 'fas fa-check-circle fa-lg',
        'messages' => $messages,
    ])
    {{ session()->forget('success_message') }}
@endif
