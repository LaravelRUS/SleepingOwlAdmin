@php
    $dialogAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class(['soa-alert-dialog'])
        ->merge(['aria-labelledby' => $titleId ?? null]);
@endphp
<dialog {!! $dialogAttributes !!}>
    @if(!empty($title))<h2 class="soa-alert-dialog-title" @if(!empty($titleId)) id="{{ $titleId }}" @endif>{!! $title !!}</h2>@endif
    @if(!empty($description))<div class="soa-alert-dialog-description">{!! $description !!}</div>@endif
    <div class="soa-alert-dialog-actions">{!! $actions ?? '' !!}</div>
</dialog>
