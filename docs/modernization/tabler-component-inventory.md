# Tabler component inventory

## Frozen upstream

| Field | Value |
| --- | --- |
| Package | `@tabler/core` |
| Release | `1.5.1`, published 2026-09-09 |
| Source | <https://github.com/tabler/tabler/tree/v1.5.1> |
| Tarball | <https://registry.npmjs.org/@tabler/core/-/core-1.5.1.tgz> |
| Integrity | `sha512-PI9rJq4H4lBh53YP/J+m5Uz6lqVQbsGPmWCMN34IP4KQQ/wy28YMO6a3Eiz1cQHdFFr+3MlU3yYhXdzvFGJfqw==` |
| License | MIT; vendored notice: [`licenses/tabler-MIT.md`](licenses/tabler-MIT.md) |
| Runtime requirements | Browser CSS only; build-time Node.js `>=20` |
| Dependency tree | `@popperjs/core ^2.11.8`; lock resolves the existing exact `2.11.8` |

The repository already locks Bootstrap `5.3.8`. Tabler's distributed CSS is a
self-contained Bootstrap-derived presentation and does not resolve the project
Bootstrap package at build time. The versions therefore do not overwrite one
another: AdminLTE keeps its existing boundary and Tabler remains in
`theme:tabler`. Tabler's aggregate JavaScript embeds its own Bootstrap runtime
and Popper and is intentionally excluded.

## Published package surface

The npm snapshot contains 50 CSS, 203 SCSS, 105 JavaScript, 116 TypeScript, 40
source-map and 648 SVG files. It contains no WOFF/WOFF2/TTF/PNG font or bitmap
assets. SleepingOwl compiles only `dist/css/tabler.css`; every URL used by that
file is an inline data URI. Flags, payments, marketing, socials, vendor extras,
Tabler Icons and all `dist/js` files are unused and unpublished.

Reproducible update workflow:

1. Query `npm view @tabler/core@<version> ... --json` and record release,
   engine, dependency, license, tarball and integrity data above.
2. Run `npm install @tabler/core@<version> --save-exact` and inspect the lock
   entry and the CSS URL/static inventory.
3. Review upstream release notes and diff the selected CSS against the previous
   snapshot. Reconfirm that aggregate JavaScript remains unnecessary.
4. Run `npm run production`, the Tabler-focused PHP/Vitest/Playwright checks,
   `php artisan sleepingowl:update --check` coverage, and the final full gate.
5. Update this inventory, the bundle report, screenshots and CHANGELOG in the
   same change.

## Blade and capability matrix

The Tabler namespace currently has zero Blade overrides. All 103 canonical
`default` logical views fall through unchanged; the theme changes presentation
only. Application overrides under
`resources/views/vendor/sleeping_owl_tabler/default` remain first. Add an
override only if a future upstream component requires semantic structure that
cannot be expressed with the canonical `soa-*`, `data-*`, ARIA and field-name
contracts.

| Surface | Upstream snapshot / presentation | Blade owner | Required states | Capability | Vendor JS |
| --- | --- | --- | --- | --- | --- |
| Shell/header/footer/auth | Tabler page, navbar, card | canonical `_layout`, `_partials`, `pages/login` | desktop/mobile, collapsed/open, light/dark, asset health | `sidebar` | none; shared sidebar/color drivers |
| Navigation/tree | Tabler navbar/nav-link presentation | canonical navigation and tree views | nested, active, expanded, rejected/error | `sidebar` | none; shared sidebar/tree drivers |
| Tabs | Tabler nav/tab presentation | canonical display/form tabbed views | selected, focus, restored, hidden panel | `tabs` | none; shared tabs driver |
| Dropdowns/actions | Tabler dropdown/button presentation | canonical display/action views | closed/open, focus, disabled, confirm/error | `dropdown` | none; shared dropdown/actions drivers |
| Tooltips | Tabler tooltip presentation | canonical tooltip partial | pointer, keyboard focus, dynamic content | `tooltip` | none; shared tooltip driver |
| Alerts/messages | Tabler alert/status presentation | canonical message and asset-health views | success/info/warning/error/dismiss | `notification` | none; shared alert driver |
| Native dialogs/editors | Tabler card/dialog presentation | canonical form and inline-editor views | open/close, focus, validation, busy/error | `modal` | none; native dialog/shared lifecycle |
| Tables/DataTables | Tabler table/control/pagination presentation | canonical displays, columns and feature views | sync/async, GET/POST, processing/error, responsive, multiple/tabs | `table-presentation` | none; shared DataTables 3 driver |
| Selection/actions/editing | Tabler state/form/control presentation | canonical display/action/editable views | one/all, bulk/custom, auto-update, text/select/date/checklist | `table-presentation` | none; shared transport/state/Tom Select adapter |
| Forms/Vue islands/uploads/editors | Tabler form/card/vendor-DOM presentation | canonical forms and Blade-provided Vue props | required/readonly/error, mount/destroy, multi-island, uploads/gallery/WYSIWYG | presentation covered; no new capability id | none; `shared:vue` and shared feature adapters |
| Icons | package Font Awesome classes | canonical Blade | existing logical classes | `icons` | none; `shared:icons` only |

## Difference decision

Layout, header, sidebar, navigation, footer, login, dashboard, displays,
DataTables, filters, actions, forms, uploads, tree and editors are inherited.
The canonical views already retain `$theme`, `$themeName`, `$themeConfig`,
`$assetHealthStatus`, messages, breadcrumbs and application assets, and expose
the accessible hooks required by the native drivers. A copied Tabler view would
therefore be identical or would encode vendor classes in a public structure;
both outcomes violate the sparse boundary.

The executable evidence is `TablerThemeTest`,
`TablerApplicationViewOverrideTest`, `tabler-theme.test.js` and the shared
browser capability matrix, which now runs Tabler beside AdminLTE and Shadcn.
