# Table registry and adapter contract

`Admin.Tables` is the engine-neutral boundary between shared admin code and a concrete table implementation. The registry is keyed by the table DOM element:

```js
const adapter = Admin.Tables.register({
    element,
    engineInstance,
    reload() {},
    destroy() {},
    clearState() {},
    selectedRows() {},
})

Admin.Tables.get(element) === adapter
Admin.Tables.unregister(element)
const unsubscribe = Admin.Tables.subscribe(({ type, adapter }) => {})

Admin.Tables.reload(element)
Admin.Tables.clearState(element)
Admin.Tables.selectedRows(element)

Admin.Tables.reload()
Admin.Tables.clearState()
```

The adapter contract deliberately contains only `element`, `engineInstance`, `reload()`, `destroy()`, `clearState()` and `selectedRows()`. `engineInstance` is an explicit escape hatch for advanced integration and may be `null`; first-party consumers use the four neutral methods.

The concrete DataTables adapter additionally exposes feature-local `refresh()`
and `refreshRow(row)` operations for inline editing. They are intentionally not
part of the core registry contract: client-side tables invalidate all DOM rows
or one DOM row respectively, while server-side tables fall back to
`draw(false)` because DataTables has no single-record AJAX transport.

Registration of the same adapter is idempotent. A different adapter for an already registered element is rejected, which catches accidental double mount instead of leaking an old engine instance. Subscribers receive `registered` and `unregistered` notifications; auto-update uses them to attach to dynamic tables and tear down its timer when a table leaves the registry. The registry itself still does not destroy adapters or render UI.

`reload(element)`, `clearState(element)` and `selectedRows(element)` address exactly one registered table. A missing adapter is diagnosed instead of silently falling back to a global table. Calls to `reload()` and `clearState()` without an element intentionally fan out to every registered adapter and return the individual results in registration order. Selection is always scoped: `selectedRows()` requires an element and validates that the adapter returned an array.

Shared consumers use these convenience methods rather than accessing `engineInstance`. Bulk and custom actions serialize the scoped row identifiers with `URLSearchParams`, and auto-update reloads only tables having any configured auto-update class. The legacy `.card` lookup used to associate an action form with its table remains outside core in the AdminLTE-facing compatibility module.

The registry does not initialize DataTables, normalize options, perform requests, manage filters/state/selection or render presentation. Those responsibilities belong to decomposed modules in the table feature and its theme adapters. During the transition, the existing DataTables 1 engine is registered through the same adapter contract from the legacy edge; this gives consumers a stable lookup without moving jQuery or engine logic into core.
