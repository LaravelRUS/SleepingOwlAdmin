@if($messages)
    <div class="alert alert-error alert-danger alert-message text-white">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>

        <i class="fas fa-times fa-lg"></i> {!! $messages !!}
    </div>

    {{ session()->forget('error_message') }}
@endif
