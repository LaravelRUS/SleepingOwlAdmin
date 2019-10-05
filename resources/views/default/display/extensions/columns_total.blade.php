<{{ $tag }} {!! $attributes !!}>
    <tr>
        @foreach ($elements as $element)
            <td {!! $element->htmlAttributesToString() !!}>
                @if($element instanceof SleepingOwl\Admin\Display\Link)
                    <a  {!! $element->attributes() !!} href="{!! $element->getUrl() !!}">{!! $element->getTitle() !!}</a>
                @else
                    <{!! $element->getTag() !!} {!!  $element->attributes() !!}>{!! $element->getText() !!}</{!! $element->getTag() !!}>
                @endif
            </td>
        @endforeach
    </tr>
</{{ $tag }}>
