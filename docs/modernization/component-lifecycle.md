# Component lifecycle

`Admin.Components` is the engine- and theme-neutral lifecycle for DOM-owned features and Vue
islands. It replaces repeated page-global initialization with explicit ownership of one host
element.

## Registering a component

```js
const unregister = Admin.Components.register({
    name: 'extension.status-preview',
    selector: '[data-status-preview]',
    mount(element) {
        const listener = () => updatePreview(element)
        element.addEventListener('change', listener)

        return () => element.removeEventListener('change', listener)
    },
})
```

`name` and `selector` are required non-empty strings, and `mount` is required. Names are unique:
a duplicate registration is diagnosed rather than replacing a live implementation. The return
value of `register()` unregisters that definition and destroys all its mounted instances; calling
it again returns `false`.

`mount` is synchronous and may return:

- a cleanup function;
- an object with a `destroy()` method;
- any instance consumed by an explicit `destroy(element, instance)` definition callback;
- no value when the component owns no teardown work.

An explicit definition callback has priority over inferred function/object cleanup.

## Scanning and mounting

```js
Admin.Components.scan(document)
Admin.Components.scan(insertedContainer)
Admin.Components.mount(oneKnownElement)
```

`scan(root)` includes a matching Element root and all matching descendants. It returns the number
of newly mounted component instances. `mount(element)` evaluates only that exact element and also
returns a count. One element may own multiple differently named components.

Both methods are idempotent per component name and element. A record is reserved before calling
the component mount function, which also prevents a re-entrant scan from mounting it twice. A
failed mount removes that record so a later call can retry.

The legacy `modules.js` entry runs one document scan after `Admin.Modules.boot()`. Code that
inserts DOM later must scan only the inserted root; the core deliberately does not install a
page-wide `MutationObserver`. Dynamic related form groups already call this boundary after their
legacy plugin rebinds.

## Blade extensions without a frontend build

A server-rendered module can register a small native component without rebuilding SleepingOwlAdmin
or installing Node.js. Put the registration in the footer stack so the published admin assets are
available, register it once, and scan because this script runs after the standard initial scan:

```blade
<div data-order-status>
    <button type="button" data-refresh-status>Refresh</button>
</div>

@once
    @push('footer-scripts')
        <script>
            Admin.Components.register({
                name: 'orders.status',
                selector: '[data-order-status]',
                mount(element) {
                    const button = element.querySelector('[data-refresh-status]');
                    const refresh = () => element.dispatchEvent(new CustomEvent('orders:refresh'));

                    button.addEventListener('click', refresh);

                    return () => button.removeEventListener('click', refresh);
                },
            });

            Admin.Components.scan(document);
        </script>
    @endpush
@endonce
```

The explicit scan is idempotent, so it does not remount components discovered earlier. A larger
extension should place the same registration in its own script and load that file through the
public asset registry; it still does not require rebuilding package assets. Long-running work must
be returned as cleanup: remove listeners, clear timers, abort requests, and call vendor instance
`destroy()` methods there. Do not use `DOMContentLoaded` as a component lifecycle because it has no
symmetric teardown and does not cover DOM inserted after the page load.

## Destroying

```js
Admin.Components.destroy(removedContainer)
```

`destroy(root)` cleans an exact mounted root and every mounted descendant, then returns the number
of removed records. Cleanup runs in reverse mount order, so nested/late dependencies are removed
before their owners. Every matching cleanup is attempted even if another throws; one error is
re-thrown directly and multiple errors are reported as `AggregateError`. Records are removed in
all cases and before cleanup starts, preventing re-entrant destroy from cleaning an instance twice
and allowing a later clean mount.

Dynamic related groups invoke this boundary before Vue removes their DOM and again from their
Vue 2 destruction hook; the second call is intentionally a no-op. Future Vue 3 islands and table,
upload, date/time, lightbox and editor drivers use the same symmetric contract.

The lifecycle stores state outside the DOM and does not add presentation classes or marker
attributes. Selectors are owned by feature markup, while visual behavior remains with the selected
theme. `Admin.Modules` continues as a legacy compatibility API during migration, but new features
register with `Admin.Components`.
