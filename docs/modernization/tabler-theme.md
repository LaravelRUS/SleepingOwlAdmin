# Built-in Tabler theme

## Purpose and visual direction

Tabler is the third product theme for backend developers and operators whose
single job is to manage data-heavy CRUD screens—navigation, tables, filters and
forms—without knowing the package's frontend build.

The design is a compact operational ledger rather than another AdminLTE skin.
Its anchor palette is Tabler blue `#206bc4`, deep navigation ink `#132238`,
paper `#ffffff`, cloud `#f4f6fa`, readable ink `#182433` and restrained teal
`#0f6b78`. Body text uses the local system UI stack, headings use the local
rounded/display stack with restrained weight, and identifiers/numeric table
headers use the local monospace stack. No font is fetched. Density is compact,
corners are 6px, elevation is quiet, and the functional signature is a narrow
"record rail" that marks the current work surface, selected navigation and
status without adding ornamental chrome.

The initial concept considered a card-heavy Tabler clone. It was rejected as a
generic dashboard treatment: CRUD operators need scan lines and stable data
geometry more than decorative cards. The implemented direction spends its one
visual motif on the record rail and leaves tables/forms calm and dense.

```text
desktop                              compact
┌──────────┬──────────────────────┐  ┌─────────────────────────┐
│ brand    │ header / actions     │  │ header / menu / actions │
│          ├──────────────────────┤  ├─────────────────────────┤
│ nav      │ ▌ title / crumbs     │  │ ▌ title / crumbs        │
│ tree     │ ┌ ledger surface ──┐ │  │ ┌ ledger surface ─────┐ │
│          │ │ filters / table  │ │  │ │ responsive content  │ │
│          │ └──────────────────┘ │  │ └─────────────────────┘ │
└──────────┴──────────────────────┘  └─────────────────────────┘
```

## Selecting and customizing

Set `SLEEPINGOWL_TEMPLATE=tabler`, or configure:

```php
'template' => [
    'default' => 'tabler',
    'themes' => [
        'tabler' => SleepingOwl\Admin\Themes\TablerTheme::class,
    ],
],
```

The theme reads the same validated runtime properties as other built-ins. In
particular, `sidebar_background_color` emits `--soa-sidebar-bg`. Applications
can override canonical `--soa-*` properties after package styles without
rebuilding. Vendor `--tblr-*` variables are an internal bridge and are not a
SleepingOwl API.

Application Blade overrides use stable paths such as:

```text
resources/views/vendor/sleeping_owl_tabler/default/_layout/inner.blade.php
```

Relative `setView()` and fully namespaced custom views are unchanged. Add
application CSS/JS through `MetaInterface` as documented in
[`theme-customization.md`](theme-customization.md); no Tabler runtime global is
available.

## Assets and behavior

`TablerTheme::assets()` declares only `shared:compatibility`, `shared:vue` and
deferred `shared:modules`. Runtime adds `core`, `shared:icons`, `shared:ui`,
`shared:features` and the CSS-only `theme:tabler`. No `theme:overrides`, feature
chunk or theme JavaScript exists. Tabs, dropdowns, tooltips, alerts, sidebar,
tables, uploads, editors and Vue islands use the common lifecycle. Font Awesome
continues to come from the single package `shared:icons` entry.

Both production and development profiles contain the same logical ids. The
former is optimized; the latter retains diagnostics/source maps. Consumers
publish both with `php artisan sleepingowl:update`, select the complete profile
with `ADMIN_DEV_ASSETS`/`sleeping_owl.dev_assets`, and verify it with
`php artisan sleepingowl:update --check`; no Node.js is required in a consuming
Laravel application.

Inventory and update evidence live in
[`tabler-component-inventory.md`](tabler-component-inventory.md). Reference
behavior uses the shared `REF-01`…`REF-09` matrix from
[`reference-screens.md`](reference-screens.md), plus
`theme-capabilities-tabler.html` at desktop/mobile and light/dark settings.
