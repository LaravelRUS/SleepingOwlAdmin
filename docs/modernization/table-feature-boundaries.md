# Table feature boundaries

The published table runtime loads pinned DataTables `3.0.3` and Responsive
`4.0.3` through an engine-neutral feature boundary. The concrete engine is
created through `createDataTableEngine(element, options)`, which owns the
`new DataTable(...)` constructor call. No jQuery object crosses into
`Admin.Tables` or the core registry, and the compiled `feature:table` entry does
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

`resources/assets/js_owl/admin/display/datatables.js` is transitional
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
`pageLength`/`search` controls and stable `info`/`paging` regions. Published
config and `setDatatableAttributes()` values using `sDom`, `bStateSave` or
`fnDrawCallback` pass through a small compatibility normalizer; an explicitly
provided current option wins over its legacy alias. Raw option migrations are
documented in [`data-table-options.md`](data-table-options.md).

The engine module imports only DataTables core and the dependency-free
Responsive core. The legacy AdminLTE presentation adapter imports the official
Bootstrap 4 DataTables core adapter. It owns both Bootstrap 4 stylesheets, but
uses `datatables.net-responsive-bs4` as CSS-only: that package's JavaScript modal
renderer still asks DataTables for jQuery and is not included. Responsive
behavior comes from `datatables.net-responsive` and the project does not use the
optional Bootstrap modal renderer.

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

The historical `default.helper.autoupdate` logical view still owns the feature
host through `features.datatables.autoupdate`. It now renders a
`template[data-admin-table-autoupdate-control]` containing exactly one root and
a descendant marked with `data-admin-table-autoupdate-close`. The table runtime
clones that root for each matching table and binds the timer teardown to the
close hook. It does not create the button, text, icon or presentation classes.

A project view override may replace the element type, classes and internal
nesting while retaining the template and close hooks. Existing auto-update
config keys, table-class matching, labels, interval, color property, reload
behavior and server-side table flow remain unchanged.

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
data-soa-inline-editor-template-id
data-soa-inline-editor-template
data-soa-inline-editor-root
data-soa-inline-editor-form
data-soa-inline-editor-control
data-soa-inline-editor-cancel
data-soa-inline-editor-error
```

Checklist inputs and range input/output elements have type-specific hooks.
Classes are not behavior hooks. A project may replace elements, icons, labels,
classes and nesting while preserving one template root and the required hooks.
The runtime clones the template, synchronizes the latest saved value, binds
events, manages busy/error/focus state and delegates date controls to the
shared component lifecycle. It does not construct editor presentation through
`createElement()`.
