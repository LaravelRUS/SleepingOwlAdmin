<div class="card card-tabbed">
    <div class="card-header d-flex">
        <nav class="w-100">
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                @foreach ($tabs as $tab)
                    {!! $tab->render() !!}
                @endforeach
            </div>
        </nav>
    </div>
    <div class="card-body">
        <div class="tab-content mt-3 {!! $classAttributes !!}"  id="nav-tabContent">
            @foreach ($tabs as $tab)
                <div class="tab-pane fade {!! ($tab->isActive()) ? 'show active' : '' !!}" id="nav-{{ $tab->getName() }}" role="tabpanel" aria-labelledby="nav-{{ $tab->getName() }}">
                    {!! $tab->addTabElement()->getContent()->render() !!}
                </div>
            @endforeach
        </div>
    </div>
</div>
