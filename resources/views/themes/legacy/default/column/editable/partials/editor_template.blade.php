<template id="{{ $editorTemplateId }}" data-inline-editor-template="{{ $editorType }}">
    <div class="soa-inline-editor soa-inline-editor-{{ $mode }}"
         data-inline-editor-root
         role="{{ $mode === 'popup' ? 'dialog' : 'group' }}">
        <form class="soa-inline-editor-form" data-inline-editor-form>
            @if($editorTitle)
                <div class="soa-inline-editor-title">{{ $editorTitle }}</div>
            @endif
            <div class="soa-inline-editor-input">
                @include(AdminTemplate::getViewPath('column.editable.partials.controls.'.$editorType))
            </div>
            <div class="soa-inline-editor-actions">
                <button class="soa-inline-editor-submit"
                        data-inline-editor-submit
                        type="submit">@lang('sleeping_owl::lang.button.save')</button>
                <button class="soa-inline-editor-cancel"
                        data-inline-editor-cancel
                        type="button">@lang('sleeping_owl::lang.button.cancel')</button>
            </div>
            <div class="soa-inline-editor-error"
                 data-inline-editor-error
                 role="alert"
                 hidden></div>
        </form>
    </div>
</template>
