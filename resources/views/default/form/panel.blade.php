<div class="card card-primary">
    <form {!! $attributes !!}>

        <div class="card-body">
            @include(AdminTemplate::getViewPath('form.partials.elements'), ['items' => $items])
        </div>

        <input type="hidden" name="_method" value="post" />
        <input type="hidden" name="_redirectBack" value="{{ $backUrl }}" />
        <input type="hidden" name="_token" value="{{ csrf_token() }}" />

        <div class="card-footer">
            {!! $buttons->render() !!}
        </div>
    </form>

</div>
