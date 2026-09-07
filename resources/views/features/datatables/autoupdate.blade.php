@php
  $autoupdate = app(\SleepingOwl\Admin\Configuration\DataTablesAutoUpdateConfiguration::class);
@endphp

@if ($autoupdate->enabled())
  <span
    data-admin-table-autoupdate
    data-close-label="{{ trans('sleeping_owl::lang.button.cancel') }}"
    data-interval="{{ $autoupdate->intervalMilliseconds() }}"
    @if ($autoupdate->tableClass() !== null)
      data-table-class="{{ $autoupdate->tableClass() }}"
    @endif
    style="--soa-datatables-autoupdate-color: {{ $autoupdate->color() }}"
    hidden
  >
    <template data-admin-table-autoupdate-control>
      <button
        class="autoupdater-close"
        data-admin-table-autoupdate-close
        type="button"
        aria-label="{{ trans('sleeping_owl::lang.button.cancel') }}"
      ><span aria-hidden="true">×</span></button>
    </template>
  </span>
@endif
