@if (!empty($value))
    <a href="{{ $value }}" {{ app('html')->attributes($linkAttributes) }}>
        @if ($icon)
            <i class="{{$icon}}" data-toggle="tooltip" title="{{ trans('sleeping_owl::lang.table.filter-goto') }}"></i>
        @endif
        @if ($text)
            {{$text}}
        @endif
    </a>
@endif
{!! $append !!}
