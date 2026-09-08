@php
    $dialogAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class(['soa-dialog'])
        ->merge(['aria-labelledby' => $titleId ?? null]);
@endphp
<dialog {!! $dialogAttributes !!}>
    <div class="soa-dialog-content">
        @if(isset($title))<h2 class="soa-dialog-title" @if(!empty($titleId)) id="{{ $titleId }}" @endif>{!! $title !!}</h2>@endif
        @if(isset($description))<div class="soa-dialog-description">{!! $description !!}</div>@endif
        {!! $content ?? '' !!}
        @if(isset($actions))<div class="soa-dialog-actions">{!! $actions !!}</div>@endif
    </div>
</dialog>
