@if(count($actions) > 0)
    @php($actionAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['soa-bulk-actions', 'card-footer' => in_array($placement, ['card.footer', 'panel.footer'])]))
    <form {!! $actionAttributes !!} id="action_form">
        {{ csrf_field() }}

        {{-- @sngrl merge: bs4 to dev --}}
        {{--
        <div class="float-start">
            <select class="form-control sleepingOwlActionsStore soa-select" name="action" tabindex="-1" aria-hidden="true">
                <option value="0">{{  trans('sleeping_owl::lang.table.no-action') }}</option>
        --}}
        <div class="action_select soa-action-select">
            <select class="form-control sleepingOwlActionsStore soa-select" id="sleepingOwlActionsStore" name="action" tabindex="-1" aria-hidden="true">
                <option value="0">{{ trans('sleeping_owl::lang.table.no-action') }}</option>
                @foreach ($actions as $action)
                    {!! $action->render() !!}
                @endforeach
            </select>
        </div>
        {{-- @sngrl merge: bs4 to dev --}}
        {{--
        <div class="float-start">
            &nbsp;
        --}}
        <div class="action_btn ps-2 soa-action-submit">
            <button type="submit" class="row-action btn btn-action btn-light soa-button soa-button-secondary" data-method="post">
                {{ trans('sleeping_owl::lang.table.make-action' )}}
            </button>
        </div>
        <div class="clearfix"></div>
    </form>
@endif
