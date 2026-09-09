@php
    $editorRootTag = $mode === 'popup' ? 'dialog' : 'div';
    $editorControlId = $editorTemplateId.'-control';
    $editorTitleId = $editorTemplateId.'-title';
    $editorCanClear = !($required ?? false)
        && !in_array($editorType, ['boolean', 'checkbox'], true)
        && !($editorType === 'checklist' && blank($value));
@endphp
<template id="{{ $editorTemplateId }}" data-inline-editor-template="{{ $editorType }}">
    <{{ $editorRootTag }} class="soa-inline-editor soa-inline-editor-{{ $mode }} soa-inline-editor-type-{{ $editorType }}"
         data-inline-editor-root
         role="{{ $mode === 'popup' ? 'dialog' : 'group' }}"
         @if($mode === 'popup') aria-modal="true" @endif
         @if($editorTitle) aria-labelledby="{{ $editorTitleId }}" @endif>
        <form class="soa-inline-editor-form" data-inline-editor-form>
            @if($editorTitle)
                <div class="soa-inline-editor-title" id="{{ $editorTitleId }}">{!! $editorTitle !!}</div>
            @endif
            <div class="soa-inline-editor-input">
                @include(AdminTemplate::getViewPath('column.editable.partials.controls.'.$editorType))
                @if($editorCanClear && !in_array($editorType, ['checklist', 'range', 'select'], true))
                    <button class="soa-inline-editor-clear soa-icon-button"
                            data-inline-editor-clear
                            type="button"
                            aria-label="@lang('sleeping_owl::lang.button.clear')"
                            title="@lang('sleeping_owl::lang.button.clear')">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                @endif
            </div>
            <div class="soa-inline-editor-actions">
                @if($editorCanClear && $editorType === 'checklist')
                    <button class="soa-inline-editor-clear-all soa-button soa-button-ghost"
                            data-inline-editor-clear
                            type="button">@lang('sleeping_owl::lang.button.clear_all')</button>
                @endif
                <button class="soa-inline-editor-submit soa-button soa-button-primary"
                        data-inline-editor-submit
                        type="submit">@lang('sleeping_owl::lang.button.save')</button>
                <button class="soa-inline-editor-cancel soa-button soa-button-secondary"
                        data-inline-editor-cancel
                        type="button">@lang('sleeping_owl::lang.button.cancel')</button>
            </div>
            <div class="soa-inline-editor-error"
                 data-inline-editor-error
                 role="alert"
                 hidden></div>
        </form>
    </{{ $editorRootTag }}>
</template>
