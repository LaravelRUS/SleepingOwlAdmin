@php
    $editorOptions = $editorOptions ?? [];
    $editorEmptyText = $editorEmptyText ?? trans('sleeping_owl::lang.select.empty');
    $editorTextHtml = $editorTextHtml ?? false;
    $editorTitle = $editorTitle ?? null;
    $editorDisplay = ($text ?? '') !== '' ? $text : $editorEmptyText;
    $editorOptionsId = 'soa-inline-editor-options-'.\Illuminate\Support\Str::uuid();
    $editorTemplateId = 'soa-inline-editor-template-'.\Illuminate\Support\Str::uuid();
    $editorAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag([
        'aria-expanded' => 'false',
        'aria-haspopup' => $mode === 'popup' ? 'dialog' : false,
        'class' => 'soa-inline-editable',
        'data-date-format' => $editorDateFormat ?? null,
        'data-display-html' => ($editorDisplayHtml ?? false) ? 'true' : null,
        'data-empty-text' => $editorEmptyText,
        'data-max' => $max ?? null,
        'data-min' => $min ?? null,
        'data-mode' => $mode,
        'data-name' => $name,
        'data-pk' => $id,
        'data-soa-inline-editor' => $editorType,
        'data-soa-inline-editor-options-id' => $editorOptionsId,
        'data-soa-inline-editor-template-id' => $editorTemplateId,
        'data-step' => $step ?? null,
        'data-title' => $editorTitle ?? null,
        'data-url' => $url,
        'data-value' => $value,
        'type' => 'button',
    ]))->getAttributes();
@endphp

<div {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []) !!}>
    @if ($visibled)
        @if(!$isReadonly)
            <button {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($editorAttributes) !!}>
                @if($editorTextHtml)
                    {!! $editorDisplay !!}
                @else
                    {{ $editorDisplay }}
                @endif
            </button>
            <script id="{{ $editorOptionsId }}" type="application/json">{!! \Illuminate\Support\Js::encode($editorOptions) !!}</script>
            @include(AdminTemplate::getViewPath('column.editable.partials.editor_template'))
        @else
            <span v-pre>{!! $text !!}</span>
        @endif

        {!! $append !!}

        @if($small)
            <small class="clearfix">{!! $small !!}</small>
        @endif
    @endif
</div>
