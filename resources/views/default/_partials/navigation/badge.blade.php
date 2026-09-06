@if ($value !== false)
@php
  $userClasses = (string) ($attributesArray['class'] ?? '');
  $useDefaultVariant = !str_contains($userClasses, 'badge-') && !str_contains($userClasses, 'bg-');
  $badgeAttributes = (new \Illuminate\View\ComponentAttributeBag($attributesArray))
      ->class(['badge', 'badge-primary' => $useDefaultVariant]);
@endphp
<small {!! $badgeAttributes !!}>
  {{ $value }}
</small>
@endif
