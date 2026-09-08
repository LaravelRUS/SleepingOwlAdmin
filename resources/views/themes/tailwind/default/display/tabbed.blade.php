<div class="card card-tabbed soa-card soa-tabbed-card">
    <div class="card-header d-flex soa-card-header">
        <nav class="w-100 soa-tabs-nav">
            <div class="nav nav-tabs soa-tabs" id="nav-tab" role="tablist">
                @foreach ($tabs as $tab)
                    {!! $tab->render() !!}
                @endforeach
            </div>
        </nav>
    </div>
    <div class="card-body soa-card-body">
        <div class="tab-content mt-3 soa-tab-content {!! $classAttributes !!}"  id="nav-tabContent">
            @foreach ($tabs as $tab)
                <div class="tab-pane fade soa-tab-panel {!! ($tab->isActive()) ? 'show active' : '' !!}" id="nav-{{ $tab->getName() }}" role="tabpanel" aria-labelledby="nav-{{ $tab->getName() }}">
                    {!! $tab->addTabElement()->getContent()->render() !!}
                </div>
            @endforeach
        </div>
    </div>
</div>
