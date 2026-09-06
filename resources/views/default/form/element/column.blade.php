@php
    $sizePrefix = $size ?: 'col-md-';
    $sizePrefix = str_contains($sizePrefix, 'col-') ? $sizePrefix : 'col-'.$sizePrefix.'-';
    $themeClasses = is_numeric($width) ? [$sizePrefix.$width] : (array) $width;
    $columnAttributes = (new \Illuminate\View\ComponentAttributeBag($attributesArray))->class($themeClasses);
@endphp
<div {!! $columnAttributes !!}>
	@include(AdminTemplate::getViewPath('form.partials.elements'), ['items' => $elements])
</div>
