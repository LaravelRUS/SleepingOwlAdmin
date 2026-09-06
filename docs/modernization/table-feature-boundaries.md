# Table feature boundaries

The published legacy runtime now loads pinned DataTables `2.3.8` and Responsive
`3.0.8` through the same decomposed feature boundary that will become the
standalone table driver. The concrete engine is created through
`createDataTables2(element, options)`, which owns the `new DataTable(...)`
constructor call; no jQuery object crosses into `Admin.Tables` or the core
registry.

| Module                             | Responsibility                                                           |
| ---------------------------------- | ------------------------------------------------------------------------ |
| `engine/extensions.js`             | error handling, custom ordering and engine extension registration        |
| `options/table-options.js`         | typed DOM definition, table options and control layout                   |
| `transport/table-ajax.js`          | unchanged server request payload and named filter data                   |
| `filters/filter-elements.js`       | filter discovery and native control values                               |
| `filters/filter-drivers.js`        | native text, select, date, daterange and range behavior                   |
| `filters/filter-controls.js`       | native execute, clear and Enter-key controls                             |
| `state/filter-state.js`            | filter persistence key, serialization, restore and search-state clearing |
| `selection/selected-rows.js`       | checked row identifiers scoped to one table element                      |
| `hooks/table-hooks.js`             | draw hook order and server-provided row classes                          |
| `lifecycle/data-table-adapter.js`  | engine creation, registry registration and adapter lifecycle             |
| `options/option-aliases.js`        | legacy option aliases at the server/config compatibility boundary        |

`resources/assets/js_owl/admin/display/datatables.js` is transitional
orchestration: it reads config, composes the modules, delegates DataTables 2
creation to the engine factory and binds legacy controls. The previous 413-line
closure, implicit globals and inline state/filter implementations are removed.

The server-side DataTables wire protocol is unchanged. Filter storage uses the
table-scoped `Filters_/route::<encoded table id>` key while retaining edit-route
normalization. Existing positional `Filters_/route` data is migrated once by
matching its containers to `data-datatables-id`; a current scoped value is
never overwritten, and an incomplete migration retains the legacy source.
Save, restore and clear operate only on the owning table, including pages with
multiple displays. Empty range objects are not persisted. State cleanup never
clears unrelated local storage. Repeated module boot resolves the registered
adapter instead of initializing a second engine for the same table.

First-party runtime options use the DataTables 2 names `layout`, `stateSave`
and `drawCallback`. Async tables receive a layout object with conditional
`pageLength`/`search` controls and stable `info`/`paging` regions. Published
config and `setDatatableAttributes()` values using `sDom`, `bStateSave` or
`fnDrawCallback` pass through a small compatibility normalizer; an explicitly
provided current option wins over its legacy alias.

The engine module under `features/table/engine` imports only DataTables core and
Responsive. The legacy AdminLTE feature adapter separately imports the
official Bootstrap 4 core/Responsive adapters and owns their CSS. The deleted
`resources/assets/js_owl/libs/datatables.js` no longer publishes
`window.DataTable`, overrides pagination or calls the private `settings.oApi`.

Error handling, custom `DateTime` ordering and range-search registration use
the extension registries exposed by the active engine. Date ordering creates a
public `DataTable.Api` instance and reads native `dataset.value`; first-party
runtime code no longer reaches the extension API through `$.fn.dataTable`.

Reusable filter drivers read values and selected options from native controls,
bind DOM events with `addEventListener`, and register client range predicates
through the injected engine. Filter execute, clear and Enter-key behavior is a
separate native module. The modern table profile contains neither jQuery nor
Moment.

The current Bootstrap DateTimePicker, Daterangepicker and Select2 integrations
still produce jQuery-only synthetic events. A small legacy AdminLTE bridge
forwards only those compatibility events and injects Moment date parsing; the
bridge is excluded from modern table profiles and is removed with the plugins
in stage 6.

Shared reload, state and selection consumers no longer call the DataTables API
directly. Bulk actions and custom action forms resolve the adapter for their
table and read `Admin.Tables.selectedRows(element)`; action submission and the
auto-update view use `Admin.Tables.reload(...)`. No first-party runtime path
creates a table through `$(element).DataTable(...)`. The remaining jQuery-based
tooltip and highlight bindings are tracked by the draw-hooks checkpoint.
