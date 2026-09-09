@if ($visibled)
<div {!! $width !!}>
  @php($selectAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['form-control', 'soa-select'])->getAttributes())
  @php($selectedValues = collect($default)->all())
  <select {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($selectAttributes) !!}>
    @foreach($options as $optionValue => $optionLabel)
      @if(is_iterable($optionLabel))
        <optgroup label="{{ $optionValue }}">
          @foreach($optionLabel as $groupValue => $groupLabel)
            <option value="{{ $groupValue }}" @selected(in_array($groupValue, $selectedValues))>{{ $groupLabel }}</option>
          @endforeach
        </optgroup>
      @else
        <option value="{{ $optionValue }}" @selected(in_array($optionValue, $selectedValues))>{{ $optionLabel }}</option>
      @endif
    @endforeach
  </select>
  @if(!empty($helpText))
    <small class="form-text text-muted soa-help-text">{!! $helpText !!}</small>
  @endif
</div>
@endif
