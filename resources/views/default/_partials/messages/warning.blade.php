@if($messages)
    <div class="alert alert-warning alert-message">
        <button type="button" class="btn-close float-end" data-dismiss="alert" data-bs-dismiss="alert" aria-label="Close"></button>

        <i class="fas fa-exclamation-triangle fa-lg"></i> {!! $messages !!}
    </div>

    {{ session()->forget('warning_message') }}
@endif
