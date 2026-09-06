@php($cardPartAttributes = (new \Illuminate\View\ComponentAttributeBag($attributesArray))->class($themeClasses))
<div {!! $cardPartAttributes !!}>
    @include(AdminTemplate::getViewPath('form.partials.elements'), ['items' => $elements])
</div>
