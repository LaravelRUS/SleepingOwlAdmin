@if ($visibled)
<div {!! $width !!}>
  <input type="text" {!! (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['form-control']) !!}/>
</div>
@endif
