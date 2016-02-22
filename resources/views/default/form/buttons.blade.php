<button
        type="submit"
        name="next_action"
        @if($showSaveAndCloseButton)
        value="save_and_continue"
        @else
        value="save_and_close"
        @endif
        class="btn btn-primary btn-flat">
    <i class="fa fa-check"></i> {{ $saveButtonText }}
</button>

@if($showSaveAndCloseButton)
    <button type="submit" name="next_action" value="save_and_close" class="btn btn-default btn-flat">
        {{ $saveAndCloseButtonText }}
    </button>
@endif

@if($showCancelButton)
    <a href="{{ $backUrl }}" class="btn btn-link btn-sm">
        <i class="fa fa-ban"></i> {{ $cancelButtonText }}
    </a>
@endif