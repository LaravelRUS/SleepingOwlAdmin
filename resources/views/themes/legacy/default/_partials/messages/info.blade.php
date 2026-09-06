@if($messages)
    <div class="alert alert-info alert-message text-white">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>

        <i class="fas fa-info fa-lg"></i> {!! $messages !!}
    </div>

    {{ session()->forget('info_message') }}
@endif
