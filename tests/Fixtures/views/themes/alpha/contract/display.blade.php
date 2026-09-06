@php($attributeBag = new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))

<section data-theme="alpha" data-instance="{{ $contractInstanceId }}" {{ $attributeBag->merge(['class' => 'alpha-display']) }}>
    <h2 data-role="display-title">{{ $title }}</h2>
</section>
