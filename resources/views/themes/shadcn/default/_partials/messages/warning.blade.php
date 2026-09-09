@if($messages)
    @include('sleeping_owl_tailwind::components.ui.alert', [
        'classes' => ['alert-warning'],
        'iconClass' => 'fas fa-exclamation-triangle fa-lg',
        'messages' => $messages,
        'role' => 'alert',
    ])
    {{ session()->forget('warning_message') }}
@endif
