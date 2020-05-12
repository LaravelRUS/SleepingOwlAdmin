@if ($breadcrumbs)
    <ol class="breadcrumb float-sm-right">
        @foreach ($breadcrumbs as $breadcrumb)
            @if ($breadcrumb->url && !$loop->last)
                <li class="breadcrumb-item"><a href="{{{ $breadcrumb->url }}}">{!! $breadcrumb->title !!}</a></li>
            @else
                <li class="breadcrumb-item active">{!! $breadcrumb->title !!}</li>
            @endif
        @endforeach
    </ol>
@endif
