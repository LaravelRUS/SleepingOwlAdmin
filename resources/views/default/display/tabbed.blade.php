<div class="card p-3">
        <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                @foreach ($tabs as $tab)
                    {!! $tab->render() !!}
                @endforeach
            </div>
        </nav>
    <div class="card-body px-1">
        <div class="tab-content mt-3 {!! $classAttributes !!}"  id="nav-tabContent">
            @foreach ($tabs as $tab)
                <div class="tab-pane fade {!! ($tab->isActive()) ? 'show active' : '' !!}" id="nav-{{ $tab->getName() }}" role="tabpanel" aria-labelledby="nav-{{ $tab->getName() }}">
                    {!! $tab->addTabElement()->getContent()->render() !!}
                </div>
            @endforeach
        </div>
    </div>
</div>
