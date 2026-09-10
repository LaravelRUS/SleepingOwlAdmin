# Native tooltips

SleepingOwlAdmin tooltips are a small framework-neutral feature. They do not call the
Bootstrap tooltip API, require Popper, or depend on jQuery. One controller is mounted on
`body` through `Admin.Components`, so controls inserted by DataTables, Vue islands, or
custom modules work without per-element initialization.

## Markup

The existing public marker remains unchanged. Package and application markup uses
`data-toggle="tooltip"` with plain-text content from `title`:

```html
<button data-toggle="tooltip" title="Remove item">Remove</button>
```

The existing `data-original-title` fallback is supported when the browser `title`
attribute is not wanted:

```html
<button data-toggle="tooltip" data-original-title="Remove item">Remove</button>
```

Supported placements are `top`, `right`, `bottom`, and `left`:

```html
<button data-toggle="tooltip" data-placement="right" title="Open details">
    Details
</button>
```

The driver flips a tooltip when the requested side does not fit and clamps it to the
viewport. Content is assigned through `textContent`; HTML from attributes is never
executed.

## Blade template

The default layout includes the logical view `default._partials.tooltip`. It renders an
inert template rather than a live popup:

```html
<template data-tooltip-template>
    <div data-tooltip-popup role="tooltip">
        <span data-tooltip-content></span>
    </div>
</template>
```

The controller clones the popup only while a tooltip is open. A project may override
this Blade view and change the popup tag, classes, and nesting while preserving the
three structural hooks. The text hook is populated with `textContent`; classes are not
resolved or translated by PHP or JavaScript.

Minimal custom themes may omit the optional template. In that case the adapter creates
one neutral classless `<div data-tooltip-popup role="tooltip">` as a compatibility
fallback. This is the only presentation-DOM fallback; the normal built-in and project
theme path is Blade-owned and requires no consumer asset rebuild.

## Accessibility and lifecycle

Tooltips open on pointer hover and keyboard focus. While visible, the trigger receives an
`aria-describedby` reference and its native `title` is temporarily removed. Both values
are restored on close. `Escape` closes the active tooltip without moving focus away from
the trigger.

The trigger publishes bubbling `tooltip:shown` and `tooltip:hidden` events. Their
`detail` contains the trigger and generated `role="tooltip"` element. The public
`Admin.Tooltips.scan(root)` method is idempotent and retained for redraw integrations;
delegation means a scan is not required for newly inserted controls.

## Compatibility

`data-toggle="tooltip"`, `data-placement`, and `data-original-title` remain the public
markup contract. Existing application views require no migration. The feature changes
only the implementation and never invokes Bootstrap's `$(element).tooltip()` API.

Presentation belongs to the selected theme. The common feature stylesheet contains only
positioning behavior; built-in themes provide their own presentation and
`--soa-tooltip-*` properties. A custom theme can override the Blade template and style
the same `data-tooltip-popup` hook without importing either built-in theme.
