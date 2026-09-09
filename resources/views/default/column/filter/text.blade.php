@if ($visibled)
<div {!! $width !!}>
  <input type="text" {!! (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['form-control', 'soa-input']) !!}/>
  @if(!empty($helpText))
    <small class="form-text text-muted soa-help-text">{!! $helpText !!}</small>
  @endif
</div>
@endif
