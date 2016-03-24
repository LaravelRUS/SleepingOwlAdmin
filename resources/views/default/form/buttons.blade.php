<div {!! $attributes !!}>
    <div class="btn-group">
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
        <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fa fa-caret-down"></i>
        </button>
        <div class="dropdown-menu btn-actions">
            <div class="btn-group-vertical">
                @if($showSaveAndCloseButton)
                    <button type="submit" name="next_action" value="save_and_close" class="btn btn-success btn-block btn-flat">
                        <i class="fa fa-check"></i>
                        {{ $saveAndCloseButtonText }}
                    </button>
                @endif
                @if($showSaveAndCreateButton)
                    <div role="separator" class="divider"></div>
                    <button type="submit" name="next_action" value="save_and_create" class="btn btn-info btn-block btn-flat">
                        <i class="fa fa-check"></i>
                        {{ $saveAndCreateButtonText }}
                    </button>
                @endif
            </div>
        </div>
    </div>

    <a href="{{ $backUrl }}" class="btn btn-link">
        <i class="fa fa-ban"></i> {{ $cancelButtonText }}
    </a>
</div>