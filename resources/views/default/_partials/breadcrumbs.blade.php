@if ($breadcrumbs)
    <ol class="breadcrumb float-sm-right">
        @foreach ($breadcrumbs as $breadcrumb)
<<<<<<< HEAD
            @if ($breadcrumb->url && !$breadcrumb->last)
                <li class="breadcrumb-item"><a href="{{{ $breadcrumb->url }}}">{{{ $breadcrumb->title }}}</a></li>
=======
            @if ($breadcrumb->url && !$loop->last)
                <li><a href="{{{ $breadcrumb->url }}}">{{{ $breadcrumb->title }}}</a></li>
>>>>>>> development
            @else
                <li class="breadcrumb-item active">{{{ $breadcrumb->title }}}</li>
            @endif
        @endforeach
    </ol>
@endif
