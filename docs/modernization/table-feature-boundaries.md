# Table feature boundaries

The transitional DataTables 1 runtime now uses the same decomposed feature boundary that will host DataTables 2. The concrete engine is still created at the legacy edge with `$(element).DataTable(options)`; no jQuery object crosses into `Admin.Tables` or the core registry.

| Module                             | Responsibility                                                           |
| ---------------------------------- | ------------------------------------------------------------------------ |
| `options/table-options.js`         | typed DOM definition, table options and control layout                   |
| `transport/table-ajax.js`          | unchanged server request payload and named filter data                   |
| `filters/filter-elements.js`       | filter discovery and native control values                               |
| `filters/legacy-filter-drivers.js` | isolated DataTables 1/date-picker compatibility handlers                 |
| `state/filter-state.js`            | filter persistence key, serialization, restore and search-state clearing |
| `selection/selected-rows.js`       | checked row identifiers scoped to one table element                      |
| `hooks/table-hooks.js`             | draw hook order and server-provided row classes                          |
| `lifecycle/data-table-adapter.js`  | engine creation, registry registration and adapter lifecycle             |

`resources/assets/js_owl/admin/display/datatables.js` is now only transitional orchestration: it reads config, composes the modules, initializes the old engine at one explicit line and binds legacy controls. The previous 413-line closure, implicit globals and inline state/filter implementations are removed.

The server-side DataTables wire protocol is unchanged. Filter storage keeps its existing `Filters_/...` key and edit-route normalization. State cleanup no longer clears unrelated local storage. Repeated module boot resolves the registered adapter instead of initializing a second engine for the same table.

The isolated legacy filter driver intentionally remains jQuery-based until the DataTables 2/native-filter milestone. It is not exported from the modern feature entry and is loaded only by the legacy aggregate. All other modules are engine-neutral or use only the public adapter surface.

Shared reload, state and selection consumers no longer call the DataTables API directly. Bulk actions and custom action forms resolve the adapter for their table and read `Admin.Tables.selectedRows(element)`; action submission and the auto-update view use `Admin.Tables.reload(...)`. The only remaining `$(element).DataTable(...)` call in the display implementation is the explicit DataTables 1 engine factory above. The pagination renderer under `libs/datatables.js` is still engine-owned and will be removed with the DataTables 2 presentation adapter milestone.
