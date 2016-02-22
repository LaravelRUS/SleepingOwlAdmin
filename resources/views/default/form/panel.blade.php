<form action="{{ $action }}" method="POST" class="panel panel-default">
    <input type="hidden" name="_token" value="{{ csrf_token() }}" />
    <input type="hidden" name="_redirectBack" value="{{ $backUrl }}" />

    @foreach($items as $panelTitle => $formItems)

    @if(!is_integer($panelTitle))
    <div class="panel-heading">
        <span class="panel-title">{{ $panelTitle }}</span>
    </div>
    @endif

    <div class="panel-body">
        @if($formItems instanceof \SleepingOwl\Admin\Form\Element\Columns)
            {!! $formItems->render() !!}
        @else
        @foreach ($formItems as $item)
            {!! $item->render() !!}
        @endforeach
        @endif
    </div>

    @endforeach

    <div class="panel-footer">
        <button type="submit" class="btn btn-primary btn-flat btn-lg">
            <i class="fa fa-check"></i> {{ trans('sleeping_owl::lang.table.save') }}
        </button>
        <a href="{{ $backUrl }}" class="btn btn-default btn-flat">
            <i class="fa fa-ban"></i>  {{ trans('sleeping_owl::lang.table.cancel') }}
        </a>
    </div>
</form>
