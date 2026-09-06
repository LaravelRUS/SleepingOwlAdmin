# DataTables 2: migration of raw options

The PHP API is unchanged: project-wide options still live in
`sleeping_owl.datatables`, and `setDatatableAttributes()` still overrides options
with the same key for one display. Unknown keys and extension-specific options
are passed through to DataTables.

SleepingOwl normalizes the existing `sDom`, `bStateSave`, and
`fnDrawCallback` aliases to `dom`, `stateSave`, and `drawCallback`. An explicitly
configured current option has priority over its alias. Other Hungarian option
names are not rejected: DataTables 2 still provides compatibility mappings for
many of them.

Only the following options were present in DataTables 1.13.11 and removed from
DataTables 2.3.8. SleepingOwl reports a browser warning and removes these keys
before constructing a table:

| DataTables 1 option | DataTables 2 migration |
| --- | --- |
| `asStripeClasses` | Move row striping to the active theme CSS. There is no direct option replacement. |
| `fnServerData` | Replace it with an `ajax` function using the DataTables 2 signature. |
| `fnServerParams` | Move request mutation to `ajax.data`. |
| `sAjaxSource` | Use `ajax`; use an object when other Ajax settings are required. |
| `sAjaxDataProp` | Use `ajax.dataSrc` inside the Ajax configuration. |

These migrations are deliberately not automatic because callback signatures and
the shape of `ajax` can differ between projects. Updating the project config is
therefore explicit and does not silently reinterpret application code.
