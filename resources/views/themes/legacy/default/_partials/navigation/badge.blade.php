@if ($value !== false)
@php
  $userClasses = (string) ($attributesArray['class'] ?? '');
  $useDefaultVariant = !str_contains($userClasses, 'badge-') && !str_contains($userClasses, 'bg-');
  $badgeAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))
      ->class(['badge', 'badge-primary' => $useDefaultVariant]);
@endphp
<small {!! $badgeAttributes !!}>
  {{ $value }}
</small>
@endif
