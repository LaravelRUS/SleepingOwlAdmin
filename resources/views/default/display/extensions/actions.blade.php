@if(count($actions) > 0)
    <form {!! $attributes !!}>
        {{ csrf_field() }}

        <div class="col-md-8">
            <select class="form-control" id="sleepingOwlActionsStore" name="action" tabindex="-1" aria-hidden="true">
                <option value="0">{{trans('sleeping_owl::lang.table.no-action')}}</option>
                @foreach ($actions as $action)
                    {!! $action->render() !!}
                @endforeach
            </select>
        </div>
        <div class="col-md-4">
            <button type="submit" class="row-action btn btn-action btn-default" data-method="post">
                {{trans('sleeping_owl::lang.table.make-action')}}
            </button>
        </div>
    </form>
@endif
