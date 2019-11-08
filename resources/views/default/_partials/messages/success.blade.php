@if($messages)
    <div class="alert alert-success alert-message text-white">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>

        <i class="fas fa-check-circle fa-lg"></i> {!! $messages !!}
    </div>

    {{ session()->forget('success_message') }}
@endif
