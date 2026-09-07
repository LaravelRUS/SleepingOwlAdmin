@php
  $autoupdate = app(\SleepingOwl\Admin\Configuration\DataTablesAutoUpdateConfiguration::class);
@endphp

@if ($autoupdate->enabled())
  <span
    data-admin-table-autoupdate
    data-pause-label="{{ trans('sleeping_owl::lang.button.pause_auto_update') }}"
    data-resume-label="{{ trans('sleeping_owl::lang.button.resume_auto_update') }}"
    data-interval="{{ $autoupdate->intervalMilliseconds() }}"
    data-table-classes="{{ json_encode($autoupdate->tableClasses()) }}"
    @if (count($autoupdate->tableClasses()) === 1)
      data-table-class="{{ $autoupdate->tableClass() }}"
    @endif
    style="--soa-datatables-autoupdate-color: {{ $autoupdate->color() }}"
    hidden
  >
    <template data-admin-table-autoupdate-control>
      <div class="autoupdater-bar" data-admin-table-autoupdate-bar>
        <button
          class="autoupdater-toggle autoupdater-close"
          data-admin-table-autoupdate-toggle
          type="button"
          aria-label="{{ trans('sleeping_owl::lang.button.pause_auto_update') }}"
          aria-pressed="false"
        >
          <span data-admin-table-autoupdate-pause-icon aria-hidden="true">Ⅱ</span>
          <span data-admin-table-autoupdate-resume-icon aria-hidden="true" hidden>▶</span>
          <span class="autoupdater-label" data-admin-table-autoupdate-label>{{ trans('sleeping_owl::lang.button.pause_auto_update') }}</span>
        </button>
      </div>
    </template>
  </span>
@endif
