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
                class="btn btn-primary">
            <i class="fa fa-check"></i> {{ $saveButtonText }}
        </button>
        @if($showSaveAndCloseButton or $showSaveAndCreateButton)
            <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa fa-caret-down"></i>
            </button>
            <div class="dropdown-menu btn-actions">
                <div class="btn-group-vertical">
                    @if($showSaveAndCloseButton)
                        <button type="submit" name="next_action" value="save_and_close" class="btn btn-success btn-block">
                            <i class="fa fa-check"></i>
                            {{ $saveAndCloseButtonText }}
                        </button>
                    @endif
                    @if($showSaveAndCreateButton)
                        <div role="separator" class="divider"></div>
                        <button type="submit" name="next_action" value="save_and_create" class="btn btn-info btn-block">
                            <i class="fa fa-check"></i>
                            {{ $saveAndCreateButtonText }}
                        </button>
                    @endif
                </div>
            </div>
        @endif
    </div>

    @if($showDeleteButton)
        <button class="btn btn-delete btn-danger" data-url="{!! $deleteUrl !!}" data-redirect="{{ $backUrl }}">
            <i class="fa fa-trash"></i> {{ $deleteButtonText }}
        </button>
    @elseif($showRestoreButton)
        <div class="btn-group">
            <button class="btn btn-restore btn-warning" data-url="{!! $restoreUrl !!}" data-redirect="{{ $editUrl }}">
                <i class="fa fa-reply"></i> {{ $restoreButtonText }}
            </button>
            @if($showDestroyButton)
                <button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fa fa-caret-down"></i>
                </button>
                <div class="dropdown-menu btn-actions">
                    <div class="btn-group-vertical">
                        <button class="btn btn-destroy btn-danger" data-url="{!! $destroyUrl !!}" data-redirect="{{ $backUrl }}">
                            <i class="fa fa-trash"></i> {{ $destroyButtonText }}
                        </button>
                    </div>
                </div>
            @endif
        </div>
    @endif

    @if($showCancelButton)
        <a href="{{ $backUrl }}" class="btn btn-link">
            <i class="fa fa-ban"></i> {{ $cancelButtonText }}
        </a>
    @endif
</div>