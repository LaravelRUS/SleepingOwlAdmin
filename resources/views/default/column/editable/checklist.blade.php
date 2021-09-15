<div {!! $attributes !!}>
  @if ($visibled)
    @if(!$isReadonly)
      <a  href="#"
          class="inline-editable"
          data-mode="{{ $mode }}"
          data-name="{{ $name }}"
          data-value="{{ $value }}"
          data-url="{{ $url }}"
          data-type="checklist"
          data-pk="{{ $id }}"
          data-title="{{ $title }}"
          data-source="{{ json_encode($options) }}"
          data-emptytext="{{ trans('sleeping_owl::lang.select.empty') }}"
          {{ $isReadonly ? 'data-disabled' : '' }}
      >{!! $text !!}</a>
    @else
        {!! $text !!}
    @endif

    {!! $append !!}

    @if($small)
      <small class="clearfix">{!! $small !!}</small>
    @endif
  @endif
</div>
