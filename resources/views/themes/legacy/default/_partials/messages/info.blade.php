@if($messages)
    <div class="alert alert-info alert-message text-white">
        <button type="button" class="btn-close float-end" data-dismiss="alert" data-bs-dismiss="alert" aria-label="Close"></button>

        <i class="fas fa-info fa-lg"></i> {!! $messages !!}
    </div>

    {{ session()->forget('info_message') }}
@endif
