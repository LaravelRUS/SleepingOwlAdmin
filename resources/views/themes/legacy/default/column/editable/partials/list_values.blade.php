@php
    $visibleValues = $maxLists > 0 ? array_slice($values, 0, $maxLists) : $values;
    $more = count($values) - count($visibleValues);
@endphp
@foreach($visibleValues as $value)
    <span class="badge table-badge" v-pre>{!! $value !!}</span>
@endforeach
@if($more > 0)
    <span class="badge bg-white text-secondary">{{ trans('sleeping_owl::lang.select.more', ['count' => $more]) }}</span>
@endif
