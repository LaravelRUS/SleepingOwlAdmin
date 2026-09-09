@if($messages)
    <div class="alert {{ $messageClasses }} soa-alert" role="{{ $messageRole }}">
        <i class="{{ $messageIcon }} fa-lg soa-alert-icon" aria-hidden="true"></i>
        <div class="soa-alert-content">{!! $messages !!}</div>
        <button type="button" class="btn-close float-end soa-alert-dismiss soa-icon-button" data-dismiss="alert" data-bs-dismiss="alert" aria-label="Close"><i class="fas fa-xmark" aria-hidden="true"></i></button>
    </div>

    {{ session()->forget($messageSession) }}
@endif
