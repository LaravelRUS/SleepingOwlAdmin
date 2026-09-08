@php($cardPartAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class($themeClasses))
<div {!! $cardPartAttributes !!}>
    @include(AdminTemplate::getViewPath('form.partials.elements'), ['items' => $elements])
</div>
