@php
    $sizePrefix = $size ?: 'col-md-';
    $sizePrefix = str_contains($sizePrefix, 'col-') ? $sizePrefix : 'col-'.$sizePrefix.'-';
    $themeClasses = ['soa-form-column', ...(is_numeric($width) ? [$sizePrefix.$width] : (array) $width)];
    $columnAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class($themeClasses);
@endphp
<div {!! $columnAttributes !!}>
	@include(AdminTemplate::getViewPath('form.partials.elements'), ['items' => $elements])
</div>
