@php($columnAttributes = new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
<div {!! $columnAttributes !!}>
  @if ($visibled)
    <div class="icheck-primary text-center soa-checkbox-wrap">
      <input {!! $columnAttributes
        ->merge(['type' => 'checkbox', 'id' => "check_{$value}", 'name' => '_id[]', 'value' => $value])
        ->class(['adminCheckboxRow', 'soa-checkbox']) !!}/>
      {!! $append !!}
      <label for="check_{{ $value }}"></label>
    </div>

    @if($small)
      <small class="clearfix">{!! $small !!}</small>
    @endif
  @endif
</div>
