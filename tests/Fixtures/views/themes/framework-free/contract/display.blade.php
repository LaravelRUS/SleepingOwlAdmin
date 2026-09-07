@php($attributeBag = new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))

<section data-contract-display data-instance="{{ $contractInstanceId }}" {{ $attributeBag->merge(['class' => 'workbench-display']) }}>
    <header class="workbench-display-header">
        <p class="workbench-kicker">Display contract</p>
        <h2 class="workbench-display-title">{{ $title }}</h2>
    </header>

    <div class="workbench-display-content">
        @yield('before.card')
    </div>
</section>
