<div class="btn-group">
    <button {!! $attributes !!}>
        {{ trans('sleeping_owl::lang.table.filters.control') }}
    </button>

    <button type="button" class="btn btn-sm btn-danger" id="filters-cancel" data-toggle="tooltip" title="{{ trans('sleeping_owl::lang.button.clear') . ' ' . trans('sleeping_owl::lang.table.all')}}">
      <i class="fas fa-times"></i>
    </button>
</div>
