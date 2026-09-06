@if ($visibled)
<div {!! $width !!}>
  @php($selectAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['form-control'])->getAttributes())
  {!! Form::select('', $options)->attributes($selectAttributes)->value($default); !!}
</div>
@endif
