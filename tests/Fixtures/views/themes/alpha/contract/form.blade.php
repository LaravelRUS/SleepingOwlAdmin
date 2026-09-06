@php($attributeBag = new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))

<form data-theme="alpha" data-instance="{{ $contractInstanceId }}" {{ $attributeBag->merge(['class' => 'alpha-form']) }}>
    <output data-role="form-value">{{ $value }}</output>
</form>
