@php($formAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['card', 'soa-card', $cardClass]))
<form {!! $formAttributes !!}>

    <input type="hidden" name="_redirectBack" value="{{ $backUrl }}"/>
    <input type="hidden" name="_token" value="{{ csrf_token() }}"/>

    <div class="card-header nav-tabs-custom pb-0 soa-card-header">
        <ul class="nav nav-tabs soa-tabs" role="tablist">
            @php($active = null)
            @foreach ($items as $label => $_tmp)
                @if (is_null($active))
                     @php($active = $label)
                @endif
                <li class="nav-item" role="presentation">
                    <a class="nav-link soa-tab-trigger {{ $active == $label ? 'active' : '' }}" href="#{{ md5($label) }}" aria-controls="{{ md5($label) }}" aria-selected="{{ $active == $label ? 'true' : 'false' }}" role="tab"
                       data-tab data-toggle="tab" data-bs-toggle="tab">{{ $label }}</a>
                </li>
            @endforeach
        </ul>
    </div>
    <div class="card-body soa-card-body">
        <div class="tab-content soa-tab-content">
            @foreach ($items as $label => $formItems)
                <div role="tabpanel" class="tab-pane fade soa-tab-panel {!! ($active == $label) ? 'show active' : '' !!}"
                     id="{{ md5($label) }}">
                    @foreach ($formItems as $item)
                        {!! $item->render() !!}
                    @endforeach
                </div>
            @endforeach
        </div>
    </div>

    {!! $buttons !!}
</form>
