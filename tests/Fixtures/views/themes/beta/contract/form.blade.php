@php($attributeBag = new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))

<div data-theme="beta" data-instance="{{ $contractInstanceId }}" {{ $attributeBag->merge(['class' => 'beta-form']) }}>
    <span data-role="form-value">{{ $value }}</span>
</div>
