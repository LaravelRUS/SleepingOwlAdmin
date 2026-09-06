@php($attributeBag = new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))

<article data-theme="beta" data-instance="{{ $contractInstanceId }}" {{ $attributeBag->merge(['class' => 'beta-display']) }}>
    <header data-role="display-title">{{ $title }}</header>
</article>
