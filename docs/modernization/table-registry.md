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
```

The adapter contract deliberately contains only `element`, `engineInstance`, `reload()`, `destroy()`, `clearState()` and `selectedRows()`. `engineInstance` is an explicit escape hatch for advanced integration and may be `null`; first-party consumers use the four neutral methods.

Registration of the same adapter is idempotent. A different adapter for an already registered element is rejected, which catches accidental double mount instead of leaking an old engine instance. Unregistering only removes the lookup: lifecycle code calls `destroy()` explicitly, so registry mutation has no hidden UI side effects.

The registry does not initialize DataTables, normalize options, perform requests, manage filters/state/selection or render presentation. Those responsibilities belong to decomposed modules in the table feature and its theme adapters. The existing DataTables 1 implementation is not registered automatically yet; it remains behind the legacy bundle until the adapter migration has characterization parity.
