@if($breadcrumbs)
    <nav aria-label="Breadcrumb">
        <ol class="breadcrumb soa-breadcrumbs">
            @foreach($breadcrumbs as $breadcrumb)
                @if($breadcrumb->url && !$loop->last)
                    <li class="breadcrumb-item soa-breadcrumb-item">
                        <a href="{{{ $breadcrumb->url }}}">{!! $breadcrumb->title !!}</a>
                    </li>
                @else
                    <li class="breadcrumb-item active soa-breadcrumb-item" aria-current="page">
                        {!! $breadcrumb->title !!}
                    </li>
                @endif
            @endforeach
        </ol>
    </nav>
@endif
