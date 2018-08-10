@if(!$groups->isEmpty())
    <h4>{!! $label !!}</h4>
@endif

<div class='grouped-elements clearfix' data-name='{{ $name }}'
     @if($limit !== null)data-limit='{{ $limit }}' @endif
     data-new-count='{{ $newEntitiesCount }}'>
    @foreach($groups as $key => $group)
        @include(AdminTemplate::getViewPath('form.element.related.group'), ['group' => $group, 'index' => $key])
    @endforeach
    <button
            type='button'
            class='grouped-elements__action pull-right related-action_add btn btn-success btn-sm'
    >
        <i class='icon icon-plus'></i> {!! trans('sleeping_owl::lang.related.add') !!}
    </button>

    @if(!$remove->isEmpty())
        @foreach($remove as $id)
            <input type='hidden' name='{{ $name }}[remove][]' value='{{ $id }}'>
        @endforeach
    @endif
</div>

<script type='text/template' id='{{ $name }}_template' class='hidden'>
    @include(AdminTemplate::getViewPath('form.element.related.group'), ['group' => new \SleepingOwl\Admin\Form\Related\Group(null, $stub->all())])
</script>
