# Dismissible alerts

SleepingOwlAdmin closes flash messages through the framework-neutral
`feature:alert` entry. Bootstrap JavaScript and a global jQuery object are not
required.

## Markup compatibility

Existing markup remains valid:

```html
<div class="alert alert-success fade show" role="alert">
    Saved
    <button type="button" data-dismiss="alert" aria-label="Close">×</button>
</div>
```

`data-dismiss="alert"`, `.alert`, `.fade` and `.show` are intentionally kept.
No `data-alert*` replacement attributes are introduced. A dismiss button
outside the alert may keep using `data-target="#alert-id"` or `href="#alert-id"`.

The behavior is delegated from the page root, so alerts inserted after initial
boot work without manual initialization.

## Events

Before closing, the alert element emits two cancelable bubbling events:

```text
alert:close
close.bs.alert
```

After removal it emits:

```text
alert:closed
closed.bs.alert
```

The `.bs.alert` names preserve the old event vocabulary for native listeners.
They are `CustomEvent` instances, not jQuery events. `event.detail` contains the
alert and the dismiss trigger.

```js
document.addEventListener('alert:close', (event) => {
    if (event.target.matches('[data-persistent]')) {
        event.preventDefault()
    }
})
```

Closed events are dispatched on the removed alert itself. A listener that must
observe them should be attached to that element before it is removed.

## Public API

The legacy aggregate exposes the controller as `Admin.Alerts`:

```js
Admin.Alerts.close(document.querySelector('#saved-message'))
Admin.Alerts.scan()
```

`feature:alert` is behavior-only. Visual presentation belongs to the selected
theme or to the user's custom classes and styles.
