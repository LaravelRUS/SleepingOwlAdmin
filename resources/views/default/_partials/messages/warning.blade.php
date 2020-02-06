@if($messages)
    <div class="alert alert-warning alert-message">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>

        <i class="fas fa-exclamation-triangle fa-lg"></i> {!! $messages !!}
    </div>

    {{ session()->forget('warning_message') }}
@endif
