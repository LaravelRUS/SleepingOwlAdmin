@if ($visibled)
<div {!! $width !!}>
  @php($selectAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['form-control'])->getAttributes())
  {!! Form::select('', $options)->attributes($selectAttributes)->value($default); !!}
  @if(!empty($helpText))
    <small class="form-text text-muted">{!! $helpText !!}</small>
  @endif
</div>
@endif
