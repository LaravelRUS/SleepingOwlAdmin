@if ($visibled)
<div {!! $width !!}>
  @php($selectAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['form-control', 'soa-select'])->getAttributes())
  {!! Form::select('', $options)->attributes($selectAttributes)->value($default); !!}
  @if(!empty($helpText))
    <small class="form-text text-muted soa-help-text">{!! $helpText !!}</small>
  @endif
</div>
@endif
