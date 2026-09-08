@php($formAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['card', $cardClass]))
<form {!! $formAttributes !!}>

    <input type="hidden" name="_redirectBack" value="{{ $backUrl }}"/>
    <input type="hidden" name="_token" value="{{ csrf_token() }}"/>

    <div class="card-header nav-tabs-custom pb-0">
        <ul class="nav nav-tabs" role="tablist">
            @php($active = null)
            @foreach ($items as $label => $_tmp)
                @if (is_null($active))
                     @php($active = $label)
                @endif
                <li class="nav-item" role="presentation">
                    <a class="nav-link {{ $active == $label ? 'active' : '' }}" href="#{{ md5($label) }}" aria-controls="{{ md5($label) }}" aria-selected="{{ $active == $label ? 'true' : 'false' }}" role="tab"
                       data-tab data-toggle="tab" data-bs-toggle="tab">{{ $label }}</a>
                </li>
            @endforeach
        </ul>
    </div>
    <div class="card-body">
        <div class="tab-content">
            @foreach ($items as $label => $formItems)
                <div role="tabpanel" class="tab-pane fade {!! ($active == $label) ? 'show active' : '' !!}"
                     id="{{ md5($label) }}">
                    @foreach ($formItems as $item)
                        {!! $item->render() !!}
                    @endforeach
                </div>
            @endforeach
        </div>
    </div>

    @include(AdminTemplate::getViewPath('form.card.buttons'), ['buttons' => $buttons])
</form>
