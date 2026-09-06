@php($formAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['card', $cardClass]))
<form {!! $formAttributes !!}>

  @include(AdminTemplate::getViewPath('form.partials.elements'), ['items' => $items])

  <input type="hidden" name="_method" value="post" />
  <input type="hidden" name="_redirectBack" value="{{ $backUrl }}" />
  <input type="hidden" name="_token" value="{{ csrf_token() }}" />
  
  @include(AdminTemplate::getViewPath('form.card.buttons'), ['buttons' => $buttons])

</form>
