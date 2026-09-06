@if ($visibled)
<div {!! $width !!}>
  @php($selectAttributes = (new \Illuminate\View\ComponentAttributeBag($attributesArray))->class(['form-control'])->getAttributes())
  {!! Form::select('', $options)->attributes($selectAttributes)->value($default); !!}
</div>
@endif
