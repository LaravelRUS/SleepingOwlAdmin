@if($messages)
    <div class="alert alert-success alert-message text-white">
        <button type="button" class="btn-close float-end" data-dismiss="alert" data-bs-dismiss="alert" aria-label="Close"></button>

        <i class="fas fa-check-circle fa-lg"></i> {!! $messages !!}
    </div>

    {{ session()->forget('success_message') }}
@endif
