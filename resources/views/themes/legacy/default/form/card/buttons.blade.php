@php
    $buttonViewData = $buttons->toArray();
    $buttonViewData['themeClasses'] = ['card-footer'];
@endphp
{!! AdminTemplate::view($buttons->getView(), $buttonViewData)->render() !!}
