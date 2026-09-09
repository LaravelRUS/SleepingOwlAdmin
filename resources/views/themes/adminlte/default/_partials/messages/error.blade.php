@if($messages)
    <div class="alert alert-error alert-danger alert-message text-white">
        <button type="button" class="btn-close float-end" data-dismiss="alert" data-bs-dismiss="alert" aria-label="Close"></button>

        <i class="fas fa-times fa-lg"></i> {!! $messages !!}
    </div>

    {{ session()->forget('error_message') }}
@endif
