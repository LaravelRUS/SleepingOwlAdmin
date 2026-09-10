# Blade view boundaries

## Ownership roots

| Root | Owner | Allowed responsibility |
| --- | --- | --- |
| `resources/views/shared` | UI core | Theme-independent composition and minimal semantic HTML with no feature lifecycle or CSS-framework classes |
| `resources/views/features` | Named feature | Feature behavior, protocol responses and theme-neutral feature markup |
| `resources/views/default` | Package default | AdminLTE-compatible presentation views that genuinely belong to the selected theme |
| `resources/views/themes/tabler/default` | Tabler theme | Only Blade implementations whose presentation differs from the package default |

`sleeping_owl::default.*` remains the compatibility namespace used by
`TemplateDefault` and existing custom templates. Its package root is
`resources/views`; application files under
`resources/views/vendor/sleeping_owl` remain first.

`sleeping_owl_tabler::default.*` keeps its separate application namespace.
Laravel registers ordered package hints for it: `themes/tabler`, then the
package root. A missing Tabler file therefore inherits the base implementation
without a bridge or runtime existence check.

When a runtime belongs to `shared` or `features`, its PHP owner now uses that
fully qualified view name directly. The breaking modernization release does
not keep one-line `default.*` bridge files merely to preserve historical paths.

## Stable resolution and custom-view API

The selected theme changes only the namespace prefix for relative logical
views. Existing rendering APIs keep their established meaning:

- `setView('display.table')` resolves relative to the selected theme's
  `viewNamespace()`;
- an already namespaced value such as `project-admin::orders.summary` passes
  through unchanged;
- `Display::addCustomView()` keeps its placement and data contract and accepts
  the same fully namespaced project views;
- `Illuminate\View\View` instances passed to `setView()` remain usable;
- no theme id, PHP semantic class map, or physical package path is inserted
  into a consumer's view name.

Laravel's ordinary application override stays first in both lookup orders:

```text
AdminLTE:
resources/views/vendor/sleeping_owl/default/<logical path>
    -> resources/views/default/<logical path>

Tabler:
resources/views/vendor/sleeping_owl_tabler/default/<logical path>
    -> resources/views/themes/tabler/default/<logical path>
    -> resources/views/default/<logical path>
```

`ApplicationViewOverrideTest` boots the package with a real simulated
application `view.paths` root and proves that the vendor override wins over the
package copy. `TablerApplicationViewOverrideTest` proves all three Tabler
levels and the unchanged namespace. `ThemeRenderingContractTest` proves both relative `setView()` and
fully namespaced `addCustomView()` through a direct `ThemeInterface`, including
unchanged data and escaped content. The contract therefore applies to the
current AdminLTE and Tabler themes and to project themes added through the same
interface; those themes provide views, not a replacement rendering API.

## Dependency direction

- A shared view must not depend on a theme, feature lifecycle, config-driven widget behavior, inline JavaScript or Vue directives.
- A feature view may use shared views and first-party support classes, but must not include `default` theme views or resolve views through `AdminTemplate`.
- A theme view may compose shared views, feature views and theme-local presentation partials.
- Bootstrap/AdminLTE classes belong to the AdminLTE-compatible `resources/views/default` base; shared and feature implementations cannot acquire them through an implicit fallback.
- A feature view that still needs framework classes remains a theme-owned feature presentation adapter; it is not moved into `features` merely because its PHP class belongs to a feature.
- New cross-layer includes use explicit `sleeping_owl::shared.*` or `sleeping_owl::features.*` paths. The only built-in presentation fallback is the ordered Tabler-to-base namespace; no semantic class resolver is introduced.

## Direct owner paths

| Runtime owner | Canonical implementation |
| --- | --- |
| `TableHeaderColumn` | `shared.column.header` |
| `FormElements` | `shared.form.elements` |
| action column | `features.display.action_option` |
| tree controls | `features.tree.controls` |
| bulk action form | `features.display.actions_form` |
| display links | `features.display.links` |
| table auto-update host | `features.datatables.autoupdate` |
| CKEditor upload response | `features.ckeditor.upload_result` |

`ViewBoundaryTest` verifies that every canonical view remains discoverable and
that shared/feature roots keep their dependency direction. Retired bridges are
preserved only under `resources/archive/unused-sources`.

## Package default and built-in theme overrides

The current compatibility implementation is explicitly identified as `adminlte` through `ThemeInterface`. Its ownership boundary is:

- default theme/template selector: `SleepingOwl\Admin\Themes\AdminLTETheme`;
- legacy template lifecycle retained for published config: `SleepingOwl\Admin\Templates\TemplateDefault`;
- Blade implementation: complete base in `resources/views/default`;
- stable logical namespace: `sleeping_owl::default`;
- current precompiled distribution: `public/default`;
- compatibility JavaScript: `resources/js/shared/legacy`; theme styles/scripts: `resources/{css,js}/themes/adminlte`; active legacy aggregate Sass: `resources/css/themes/adminlte/legacy`.

Tabler keeps `sleeping_owl_tabler::default`, stores only structurally different
views in `resources/views/themes/tabler/default` and inherits the remaining
presentation views from the same base. External namespaces
remain isolated unless their own provider explicitly
registers a fallback. The physical view move does not change logical view names,
template config, published override priority or public asset URLs. The stable
`adminlte` id names a compatibility handle, not the installed AdminLTE major
version.

## Executable dependency guards

`ThemeDependencyBoundaryTest` protects the direction of dependencies in all server-side layers:

- PHP outside concrete theme directories cannot reference concrete theme or legacy subnamespaces;
- shared and feature Blade roots cannot refer to physical theme paths;
- frontend core module specifiers cannot point into `features` or `themes`.

`ViewBoundaryTest` walks every base Blade file and proves that each theme-owned
view resolves through its `sleeping_owl::default.*` logical name. The Tabler
rendering contracts repeat that walk through the Tabler namespace, select the
theme file when present and the base file otherwise, and reject an override
identical to base.

The modern frontend ESLint config repeats the `core → features/themes` restriction through `no-restricted-imports`, so a new JavaScript violation fails at lint time before the wider PHPUnit architecture gate. Theme selection remains data-driven through `sleeping_owl.template`; adding a theme does not authorize a core import of its implementation.
