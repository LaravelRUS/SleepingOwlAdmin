@if(!empty($filter_title))
    <h4 class="page-title">
        {{ $filter_title }}:
@endif

@foreach($filters as $filter)
    <small class="label label-default">
        {{ $filter->getTitle() }}

        <a href="{{ URL::current() }}?{!! http_build_query(request()->except($filter->getName())) !!}">
            <span aria-hidden="true">&times;</span>
        </a>
    </small>
@endforeach

@if(!empty($filter_title))
    </h4>
@endif