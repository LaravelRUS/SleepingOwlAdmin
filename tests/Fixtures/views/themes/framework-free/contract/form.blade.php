@php($attributeBag = new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))

<form data-contract-form data-instance="{{ $contractInstanceId }}" {{ $attributeBag->merge(['class' => 'workbench-form']) }}>
    <label class="workbench-form-label" for="workbench-value">Form contract</label>
    <output class="workbench-form-value" id="workbench-value">{{ $value }}</output>
    <button class="workbench-button" type="submit">Save changes</button>
</form>
