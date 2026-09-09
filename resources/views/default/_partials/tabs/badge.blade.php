@php
    $userClasses = (string) ($attributesArray['class'] ?? '');
    $useDefaultVariant = !str_contains($userClasses, 'badge-') && !str_contains($userClasses, 'bg-');
    $badgeAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))
        ->class(['badge', 'soa-badge', 'text-bg-primary' => $useDefaultVariant]);
@endphp
<small {!! $badgeAttributes !!}>
    {{ $value }}
</small>
