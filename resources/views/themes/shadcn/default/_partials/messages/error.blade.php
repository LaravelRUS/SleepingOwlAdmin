@if($messages)
    @include('sleeping_owl_shadcn::components.ui.alert', [
        'classes' => ['alert-error', 'alert-danger'],
        'iconClass' => 'fas fa-times fa-lg',
        'messages' => $messages,
        'role' => 'alert',
    ])
    {{ session()->forget('error_message') }}
@endif
