# Table feature boundaries

The published table runtime loads pinned DataTables `3.0.3` and Responsive
`4.0.3` through an engine-neutral feature boundary. The concrete engine is
created through `createDataTableEngine(element, options)`, which owns the
`new DataTable(...)` constructor call. No jQuery object crosses into
`Admin.Tables` or the core registry, and the compiled `shared:features` entry does
not contain the jQuery library.

| Module                            | Responsibility                                                            |
| --------------------------------- | ------------------------------------------------------------------------- |
| `engine/data-table-engine.js`     | dependency-free core/Responsive runtime, constructor and version contract |
| `engine/extensions.js`            | error handling, custom ordering and engine extension registration         |
| `options/table-options.js`        | typed DOM definition, table options and control layout                    |
| `transport/table-ajax.js`         | unchanged server request payload and named filter data                    |
| `filters/filter-elements.js`      | filter discovery and native control values                                |
| `filters/filter-drivers.js`       | native text, select, date, daterange and range behavior                   |
| `filters/filter-controls.js`      | native execute, clear and Enter-key controls                              |
| `state/filter-state.js`           | filter persistence key, serialization, restore and search-state clearing  |
| `selection/selected-rows.js`      | checked row identifiers scoped to one table element                       |
| `hooks/table-hooks.js`            | draw hook order and server-provided row classes                           |
| `lifecycle/data-table-adapter.js` | engine creation, registry registration and adapter lifecycle              |
| `options/option-aliases.js`       | legacy option aliases at the server/config compatibility boundary         |

`resources/js/shared/legacy/admin/display/datatables.js` is transitional
orchestration: it reads config, composes the modules, delegates engine creation
to the neutral factory and binds legacy controls. The previous 413-line closure,
implicit globals and inline state/filter implementations are removed.

The server-side DataTables wire protocol is unchanged. Async displays still
send the established DataTables request fields, including `draw`, pagination,
ordering, global search, per-column search and named SleepingOwl filters. The
endpoint still responds with `draw`, `recordsTotal`, `recordsFiltered` and
`data`; `AdminDisplay::datatables()` and the existing async PHP implementation
remain the public API. Filter storage uses the table-scoped
`Filters_/route::<encoded table id>` key while retaining edit-route
normalization. Existing positional `Filters_/route` data is migrated once by
matching its containers to `data-datatables-id`; a current scoped value is
never overwritten, and an incomplete migration retains the legacy source.
Save, restore and clear operate only on the owning table, including pages with
multiple displays. Empty range objects are not persisted. State cleanup never
clears unrelated local storage. Repeated module boot resolves the registered
adapter instead of initializing a second engine for the same table.
The DataTables 3 native transport keeps cache busting for `GET`/`HEAD`, while
`POST` and other mutation methods retain the previous URL without an added
cache-buster parameter.

First-party runtime options use the current names `layout`, `stateSave` and
`drawCallback`. Async tables receive a layout object with conditional
`pageLength`/`search` controls and a stable `paging` region. The `info` region is
enabled by default; `datatables_settings.display_info = false` removes it and
skips the separate unfiltered total-count query while retaining the filtered
count required by numbered pagination. Published config and
`setDatatableAttributes()` values using `sDom`, `bStateSave` or
`fnDrawCallback` pass through a small compatibility normalizer; an explicitly
provided current option wins over its legacy alias. Raw option migrations are
documented in [`data-table-options.md`](data-table-options.md).

The engine module imports only DataTables core and the dependency-free
Responsive core. The AdminLTE presentation adapter imports the official
Bootstrap 5 DataTables and Responsive adapters. Their JavaScript packages are
native DataTables 3 modules and do not introduce jQuery. No legacy Bootstrap 4
adapter remains.

Error handling, custom `DateTime` ordering and range-search registration use
the extension registries exposed by the active engine. Date ordering creates a
public `DataTable.Api` instance and reads native `dataset.value`. A range-search
callback compares its callback settings object with the active table settings by
identity; it does not read private settings fields. DataTables 3 invokes draw
callbacks with a `DataTable.Dom` context that retains the public `.api()` method.
The legacy `datatables::draw` event currently receives that raw context for soft
compatibility, but no `.jquery` surface is exposed.

Reusable filter drivers read values and selected options from native controls,
bind DOM events with `addEventListener`, and register client range predicates
through the injected engine. Filter execute, clear and Enter-key behavior is a
separate native module. The modern table profile contains neither the jQuery
library nor Moment.

The date, datetime, range, and Vue Multiselect controls now dispatch native
`change` events. Table date filters share the Air Datepicker format parser, so
the former AdminLTE jQuery/Moment event bridge has been removed. Moment remains
outside the reusable table feature and is temporarily owned only by the legacy
X-editable adapter.

Shared reload, state and selection consumers no longer call the DataTables API
directly. Bulk actions and custom action forms resolve the adapter for their
table and read `Admin.Tables.selectedRows(element)`; action submission and the
auto-update view use `Admin.Tables.reload(...)`. No first-party runtime path
creates a table through `$(element).DataTable(...)`.

## Blade-owned auto-update control

The canonical `features.datatables.autoupdate` view owns the feature host and
is included directly by the base layout. It renders a
`template[data-admin-table-autoupdate-control]` containing exactly one root and
a descendant marked with `data-admin-table-autoupdate-toggle`. The table runtime
clones that root for each matching table, inserts it immediately before the
table and binds pause/resume behavior to the toggle hook. It does not create the
button, text, icon or presentation classes. The legacy
`data-admin-table-autoupdate-close` hook is still accepted by project overrides.

Auto-update presentation has one framework-free owner in
`resources/css/shared/features/table/_auto-update.scss`. It styles the public
`data-admin-table-autoupdate-*` hooks and is included by `shared:features` for
every modern theme; the legacy aggregate compiles the same partial. Theme table
bundles do not contain auto-update selectors or geometry.

A project view override may replace the element type, classes and internal
nesting while retaining the template and toggle hooks. Auto-update is configured
with the global `datatables_settings.autoupdate.enabled` flag and
`datatables_settings.autoupdate.profiles.<table-class>` entries. Each table class
owns its own `interval` in seconds and validated `color`. The Blade layer emits
one host and one control template containing all profiles as serialized data;
the runtime selects the first profile matching each table. No DataTables feature
is registered when auto-update is disabled or no rendered table matches a
profile. `autoupdate` is the standard pre-existing table marker; `autoupdater`
is a different runtime state class added automatically after the feature mounts.

The host scan is repeated after `DOMContentLoaded` because the historical base
layout renders the Blade host after its scripts. The controller also subscribes
to `Admin.Tables`, so matching tables registered later receive an independent
timer and unregistering a table tears its timer and progress bar down.

## Blade-owned inline editor

Inline editing remains a small SleepingOwl feature over the DataTables 3 core;
it does not depend on the separately licensed DataTables Editor product or its
server protocol. The existing `AdminDisplay::datatables()` and
`/async-inline` PHP flow therefore remain unchanged for synchronous and
server-side displays.

The historical `default.column.editable.partials.editor` logical owner renders
the trigger, inert options JSON and a referenced Blade `<template>`. Its
`partials.editor_template` view owns the editor shell, form, title, actions,
labels and error region. Nine independently overrideable views below
`column.editable.partials.controls` own `text`, `textarea`, `number`, `range`,
`select`, `checkbox`, `checklist`, `date` and `datetime` controls.

JavaScript requires only the following structural hooks:

```text
data-inline-editor-template-id
data-inline-editor-template
data-inline-editor-root
data-inline-editor-form
data-inline-editor-control
data-inline-editor-cancel
data-inline-editor-error
```

Checklist inputs and range input/output elements have type-specific hooks.
Classes are not behavior hooks. A project may replace elements, icons, labels,
classes and nesting while preserving one template root and the required hooks.
The runtime clones the template, synchronizes the latest saved value, binds
events, manages busy/error/focus state and delegates date controls to the
shared component lifecycle. It does not construct editor presentation through
`createElement()`.
