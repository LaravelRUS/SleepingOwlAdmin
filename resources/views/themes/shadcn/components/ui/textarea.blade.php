@php
    $textareaAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class(['soa-textarea']);
@endphp
<textarea {!! $textareaAttributes !!}>{!! $content ?? '' !!}</textarea>
