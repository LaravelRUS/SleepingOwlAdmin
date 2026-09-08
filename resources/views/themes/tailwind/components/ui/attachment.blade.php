@php
    $attachmentAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class(['soa-attachment']);
@endphp
<article {!! $attachmentAttributes !!}>
    @if(isset($preview))<div class="soa-attachment-preview">{!! $preview !!}</div>@endif
    <div class="soa-attachment-info">{!! $content ?? '' !!}</div>
    @if(isset($actions))<div class="soa-attachment-actions">{!! $actions !!}</div>@endif
</article>
