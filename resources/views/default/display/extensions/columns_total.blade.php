<{{ $tag }} {!! (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['table-hover']) !!}>
    <tr>
        @foreach ($elements as $element)
            <td {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($element->getHtmlAttributes()) !!}>
                @if($element instanceof SleepingOwl\Admin\Display\Link)
                    <a {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($element->getHtmlAttributes()) !!} href="{!! $element->getUrl() !!}">{!! $element->getTitle() !!}</a>
                @else
                    <{!! $element->getTag() !!} {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($element->getHtmlAttributes()) !!}>{!! $element->getText() !!}</{!! $element->getTag() !!}>
                @endif
            </td>
        @endforeach
    </tr>
</{{ $tag }}>
