@if(count($actions) > 0)
    <form {!! $attributes !!} id="action_form">
        {{ csrf_field() }}

        <div class="action_select">
            <select class="form-control" id="sleepingOwlActionsStore" name="action" tabindex="-1" aria-hidden="true">
                <option value="0">{{trans('sleeping_owl::lang.table.no-action')}}</option>
                @foreach ($actions as $action)
                    {!! $action->render() !!}
                @endforeach
            </select>
        </div>
        <div class="action_btn pl-2">
            <button type="submit" class="row-action btn btn-action btn-default" data-method="post">
                {{trans('sleeping_owl::lang.table.make-action')}}
            </button>
        </div>
    </form>
@endif
