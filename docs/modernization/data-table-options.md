# DataTables 3: migration of raw options

The PHP API is unchanged: project-wide options still live in
`sleeping_owl.datatables`, and `setDatatableAttributes()` still overrides options
with the same key for one display. Unknown keys and extension-specific options
are passed through to the active table engine.

SleepingOwl normalizes the existing `sDom`, `bStateSave`, and
`fnDrawCallback` aliases to `dom`, `stateSave`, and `drawCallback`. An explicitly
configured current option has priority over its alias. Other Hungarian option
names are not rejected: DataTables 3.0.3 still provides compatibility mappings
for many of them.

The following options were already removed by DataTables 2.3.8 and remain
unsupported by DataTables 3.0.3. SleepingOwl reports a browser warning and
removes these keys before constructing a table:

| DataTables 1 option | Current migration                                                                 |
| ------------------- | --------------------------------------------------------------------------------- |
| `asStripeClasses`   | Move row striping to the active theme CSS. There is no direct option replacement. |
| `fnServerData`      | Replace it with an `ajax` function using the current DataTables signature.        |
| `fnServerParams`    | Move request mutation to `ajax.data`.                                             |
| `sAjaxSource`       | Use `ajax`; use an object when other Ajax settings are required.                  |
| `sAjaxDataProp`     | Use `ajax.dataSrc` inside the Ajax configuration.                                 |

These migrations are deliberately not automatic because callback signatures and
the shape of `ajax` can differ between projects. Updating the project config is
therefore explicit and does not silently reinterpret application code. The
concrete DataTables major is intentionally absent from the PHP API and remains
an implementation detail of `data-table-engine`.
