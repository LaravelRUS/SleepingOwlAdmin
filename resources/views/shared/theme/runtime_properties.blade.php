@php
    $properties = ($themeCssVariables ?? app(\SleepingOwl\Admin\Themes\ThemeCssVariables::class))->all();
@endphp

@if($properties !== [])
<style data-runtime-properties>
    :root,
    :root[data-color-scheme="dark"] {
        @foreach($properties as $name => $value)
        {{ $name }}: {{ $value }};
        @endforeach
    }
</style>
@endif
