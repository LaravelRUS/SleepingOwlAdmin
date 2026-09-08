@php
    $element = ($element ?? 'button') === 'a' ? 'a' : 'button';
    $variant = $variant ?? 'secondary';
    $size = $size ?? 'default';
    $buttonAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
        ->class([
            'soa-button',
            'soa-button-'.$variant,
            'soa-button-'.$size => $size !== 'default',
            'soa-icon-button' => ($iconOnly ?? false),
        ]);

    if ($element === 'button' && !$buttonAttributes->has('type')) {
        $buttonAttributes = $buttonAttributes->merge(['type' => 'button']);
    }
@endphp

@if($element === 'a')
    <a {!! $buttonAttributes !!}>{!! $content ?? '' !!}</a>
@else
    <button {!! $buttonAttributes !!}>{!! $content ?? '' !!}</button>
@endif
