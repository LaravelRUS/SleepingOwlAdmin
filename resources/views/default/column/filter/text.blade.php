@if ($visibled)
<div {!! $width !!}>
  <input type="text" {!! (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['form-control']) !!}/>
  @if(!empty($helpText))
    <small class="form-text text-muted">{!! $helpText !!}</small>
  @endif
</div>
@endif
