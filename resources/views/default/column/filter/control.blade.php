<div class="btn-group button-filter-control soa-button-group">
    @yield('filter.button')

    <button {!! (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['btn', 'btn-sm', 'btn-primary', 'soa-button', 'soa-button-sm', 'soa-button-primary']) !!}>
        {{ trans('sleeping_owl::lang.table.filters.control') }}
    </button>

    <button type="button" class="btn btn-sm btn-danger soa-button soa-button-sm soa-button-danger" id="filters-cancel" data-toggle="tooltip" data-bs-toggle="tooltip" title="{{ trans('sleeping_owl::lang.button.clear') . ' ' . trans('sleeping_owl::lang.table.all')}}">
      <i class="fas fa-times"></i>
    </button>
</div>
