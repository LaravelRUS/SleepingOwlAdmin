<form action="{{ $action }}" method="POST">
    <input type="hidden" name="_token" value="{{ csrf_token() }}" />
    <input type="hidden" name="_redirectBack" value="{{ $backUrl }}" />

    @foreach($items as $panelTitle => $formItems)
        <div class="panel panel-default">
            <div class="panel-heading">
                {{ $panelTitle  }}
            </div>
            <div class="panel-body">
                @foreach ($formItems as $item)
                    {!! $item->render() !!}
                @endforeach
            </div>
        </div>
    @endforeach
    <div class="form-group">
        <input type="submit" value="{{ trans('sleeping_owl::lang.table.save') }}" class="btn btn-primary flat"/>
        <a href="{{ $backUrl }}" class="btn btn-default flat">{{ trans('sleeping_owl::lang.table.cancel') }}</a>
    </div>
</form>
