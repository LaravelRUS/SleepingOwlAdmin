<form {!! $attributes !!}>

    <input type="hidden" name="_redirectBack" value="{{ $backUrl }}" />
    <input type="hidden" name="_token" value="{{ csrf_token() }}" />

    @if(!empty($data = $items[\SleepingOwl\Admin\Form\FormPanel::POSITION_HEADER]))
    <div class="panel-heading">
        @include(AdminTemplate::getViewPath('form.partials.elements'), ['items' => $data])
    </div>
    @endif

    @if(!empty($data = $items[\SleepingOwl\Admin\Form\FormPanel::POSITION_BODY]))
    <div class="panel-body">
        @include(AdminTemplate::getViewPath('form.partials.elements'), ['items' => $data])
    </div>
    @endif

    @if(!empty($data = $items[\SleepingOwl\Admin\Form\FormPanel::POSITION_FOOTER]))
        <div class="panel-footer">
            @include(AdminTemplate::getViewPath('form.partials.elements'), ['items' => $data])
        </div>
    @endif

    {!! $buttons->render() !!}
</form>
