@php
    $properties = ($themeCssVariables ?? app(\SleepingOwl\Admin\Themes\ThemeCssVariables::class))->all();
@endphp

@if($properties !== [])
<style data-soa-runtime-properties>
    :root,
    :root[data-soa-color-scheme="dark"] {
        @foreach($properties as $name => $value)
        {{ $name }}: {{ $value }};
        @endforeach
    }
</style>
@endif
