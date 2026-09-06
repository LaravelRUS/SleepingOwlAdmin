@if ($visibled)
<div {!! $width !!}>
  <input type="text" {!! (new \Illuminate\View\ComponentAttributeBag($attributesArray))->class(['form-control']) !!}/>
</div>
@endif
