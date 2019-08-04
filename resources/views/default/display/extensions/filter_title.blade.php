@if(!empty($filter_title))
    <h4 class="page-title">
        {{ $filter_title }}:
@endif

@foreach($filters as $filter)
    <small class="badge badge-info p-2 filter-badge">
        {{ $filter->getTitle() }}

        <a href="{{ URL::current() }}?{!! http_build_query(request()->except($filter->getAlias())) !!}">
            <span aria-hidden="true">&times;</span>
        </a>
    </small>
@endforeach

@if(!empty($filter_title))
    </h4>
@endif
