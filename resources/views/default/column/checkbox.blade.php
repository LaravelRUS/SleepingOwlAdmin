<div {!! $attributes !!}>
  <div class="icheck-primary text-center">
    <input type="checkbox" class="adminCheckboxRow" id="check_{{ $value }}" name="_id[]" value="{{ $value }}"/>
    {!! $append !!}
    <label for="check_{{ $value }}"></label>
  </div>
</div>
