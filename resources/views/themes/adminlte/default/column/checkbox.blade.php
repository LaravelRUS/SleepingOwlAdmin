@php($columnAttributes = new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
<div {!! $columnAttributes !!}>
  @if ($visibled)
    <div class="icheck-primary text-center">
      <input {!! $columnAttributes
        ->merge(['type' => 'checkbox', 'id' => "check_{$value}", 'name' => '_id[]', 'value' => $value])
        ->class(['adminCheckboxRow']) !!}/>
      {!! $append !!}
      <label for="check_{{ $value }}"></label>
    </div>

    @if($small)
      <small class="clearfix">{!! $small !!}</small>
    @endif
  @endif
</div>
