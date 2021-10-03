<div {!! $attributes !!}>
  @if ($visibled)
    @if ($maxLists && count($values) > $maxLists)
      @php
        $count = 0;
        $more = count($values) - $maxLists;
      @endphp

      @foreach ($values as $value)
        @php
          if(++$count > $maxLists) break;
        @endphp
        <span class="badge table-badge" v-pre>{!! $value !!}</span>
      @endforeach
        <span class="badge bg-white text-secondary">{{ trans('sleeping_owl::lang.select.more', ['count' => $more]) }}</span>

    @else
      @foreach ($values as $value)
        <span class="badge table-badge" v-pre>{!! $value !!}</span>
      @endforeach
    @endif


    {!! $append !!}

    @if($small)
      <small class="clearfix">{!! $small !!}</small>
    @endif
  @endif
</div>
