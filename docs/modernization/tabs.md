# Tabs migration

Tabs now use a small native driver registered through `Admin.Components`. The
driver does not call the Bootstrap jQuery tab API and is shipped inside the
precompiled `shared:features` entry in both asset profiles.
When loaded after `admin-core`, that browser entry registers and scans the
driver directly; it does not depend on the transitional legacy module runner.

## Markup and accessibility

New markup uses `data-tab` inside a tab list identified by
`data-tablist` or `role="tablist"`:

```html
<div data-tablist role="tablist">
    <button data-tab aria-controls="general">General</button>
    <button data-tab aria-controls="advanced">Advanced</button>
</div>
<section id="general" role="tabpanel">...</section>
<section id="advanced" role="tabpanel">...</section>
```

The target may also be declared by a same-page `href="#panel-id"`. The driver
owns `active`, `show`, `in`, `hidden`, `aria-selected`, `role`, and tab order
state. Arrow keys wrap inside one list and skip disabled tabs; Home and End move
to the first and last enabled tab.

The previous `data-toggle="tab"` marker remains a deprecated compatibility
selector for custom or published views. Package-owned views use only
`data-tab`; PHP continues to pass user classes and attributes directly.

## State and events

The `datatables_settings.state_tabs` config key enables persistence. The driver
reads and writes the historical `Tabbed_<pathname>` localStorage key, including
the old numeric edit-route normalization. Invalid JSON or a storage quota error
does not clear unrelated application storage.

Activated tabs dispatch bubbling `tab:hidden` and `tab:shown` CustomEvents.
Their detail contains `tab`, `panel`, and `relatedTab`. The existing internal
`bootstrap::tab::hidden` and `bootstrap::tab::shown` Admin events remain
available during migration, so tree and inline-editor scans keep working.

## Theme ownership

Behavior belongs to the shared tabs source folder; it does not contain Bootstrap, AdminLTE,
shadcn, jQuery, or presentation classes. AdminLTE and shadcn provide independent source
adapters that compile into their theme bundles:

```text
theme:adminlte
theme:shadcn
```

Colors are declared in each adapter's `_colors.scss`; dimensions and public
`--soa-tabs-*` hooks stay in the same adapter module. A custom theme
can provide its own adapter without replacing the driver.
