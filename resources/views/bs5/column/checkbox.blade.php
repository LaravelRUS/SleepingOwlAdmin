<div {!! $attributes !!}>
  @if ($visibled)
    <div class="icheck-primary text-center">
      <input type="checkbox" class="adminCheckboxRow" id="check_{{ $value }}" name="_id[]" value="{{ $value }}" {!! $attributes !!}/>
      {!! $append !!}
      <label for="check_{{ $value }}"></label>
    </div>

    @if($small)
      <small class="clearfix">{!! $small !!}</small>
    @endif
  @endif
</div>
