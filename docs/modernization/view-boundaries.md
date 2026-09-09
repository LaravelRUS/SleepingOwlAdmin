# Blade view boundaries

## Ownership roots

| Root | Owner | Allowed responsibility |
| --- | --- | --- |
| `resources/views/shared` | UI core | Theme-independent composition and minimal semantic HTML with no feature lifecycle or CSS-framework classes |
| `resources/views/features` | Named feature | Feature behavior, protocol responses and theme-neutral feature markup |
| `resources/views/default` | Package default | Complete AdminLTE-compatible base contract for every `sleeping_owl::default.*` logical path |
| `resources/views/themes/shadcn/default` | Shadcn theme | Only Blade implementations whose presentation differs from the package default |
| `resources/archive/unused-sources/resources/views/themes/shadcn/components` | Archive only | Retired component prototypes; never a runtime view root |

`sleeping_owl::default.*` remains the compatibility namespace used by
`TemplateDefault` and existing custom templates. Its package root is
`resources/views`; application files under
`resources/views/vendor/sleeping_owl` remain first.

`sleeping_owl_shadcn::default.*` keeps its separate application namespace.
Laravel registers ordered package hints for it: `themes/shadcn`, then the
package root. A missing Shadcn file therefore inherits the base implementation
without a bridge or runtime existence check. The current tree contains 136
base logical views and four real Shadcn overrides. The earlier 27 component
prototypes are archived because all useful `soa-*` hooks now live directly in
the shared base markup and no runtime view references them.

When a historical path now belongs to `shared` or `features`, its file inside the legacy theme is kept as a one-line bridge include. This preserves published view overrides and PHP view names while moving the implementation to its real owner.

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

Shadcn:
resources/views/vendor/sleeping_owl_shadcn/default/<logical path>
    -> resources/views/themes/shadcn/default/<logical path>
    -> resources/views/default/<logical path>
```

`ApplicationViewOverrideTest` boots the package with a real simulated
application `view.paths` root and proves that the vendor override wins over the
package copy. `ShadcnApplicationViewOverrideTest` proves all three Shadcn
levels and the unchanged namespace. `ThemeRenderingContractTest` proves both relative `setView()` and
fully namespaced `addCustomView()` through a direct `ThemeInterface`, including
unchanged data and escaped content. The contract therefore applies to the
current AdminLTE theme and to Tailwind or project themes added through the same
interface; those themes provide views, not a replacement rendering API.

## Dependency direction

- A shared view must not depend on a theme, feature lifecycle, config-driven widget behavior, inline JavaScript or Vue directives.
- A feature view may use shared views and first-party support classes, but must not include `default` theme views or resolve views through `AdminTemplate`.
- A theme view may compose shared views, feature views and theme-local presentation partials.
- Bootstrap/AdminLTE classes belong to the AdminLTE-compatible `resources/views/default` base; shared and feature implementations cannot acquire them through an implicit fallback.
- A feature view that still needs framework classes remains a theme-owned feature presentation adapter; it is not moved into `features` merely because its PHP class belongs to a feature.
- New cross-layer includes use explicit `sleeping_owl::shared.*` or `sleeping_owl::features.*` paths. The only built-in presentation fallback is the ordered Shadcn-to-base namespace; no semantic class resolver is introduced.

## Compatibility bridges

| Historical path | Owned implementation |
| --- | --- |
| `default.column.header` | `shared.column.header` |
| `default.form.element.formelements` | `shared.form.elements` |
| `default.column.action` | `features.display.action_option` |
| `default.column.tree_control` | `features.tree.controls` |
| `default.display.extensions.actions_form` | `features.display.actions_form` |
| `default.display.extensions.links` | `features.display.links` |
| `default.helper.autoupdate` | `features.datatables.autoupdate` |
| `default.helper.ckeditor.ckeditor_upload_file` | `features.ckeditor.upload_result` |

The bridge list is executable contract data in `ViewBoundaryTest`: every listed legacy file must contain only its include, and every owned view must be discoverable through the existing `sleeping_owl` namespace.

## Package default and built-in theme overrides

The current compatibility implementation is explicitly identified as `adminlte` through `ThemeInterface`. Its ownership boundary is:

- default theme/template selector: `SleepingOwl\Admin\Themes\AdminLTETheme`;
- legacy template lifecycle retained for published config: `SleepingOwl\Admin\Templates\TemplateDefault`;
- Blade implementation: complete base in `resources/views/default`;
- stable logical namespace: `sleeping_owl::default`;
- current precompiled distribution: `public/default`;
- compatibility JavaScript: `resources/js/shared/legacy`; theme styles/scripts: `resources/{css,js}/themes/adminlte`; active legacy aggregate Sass: `resources/css/themes/adminlte/legacy`.

Shadcn keeps `sleeping_owl_shadcn::default`, stores only four structurally or
behaviorally different files in `resources/views/themes/shadcn/default` and
inherits the other 132 logical views from the same base. External namespaces
remain isolated unless their own provider explicitly
registers a fallback. The physical view move does not change logical view names,
template config, published override priority or public asset URLs. The stable
`adminlte` id names a compatibility handle, not the installed AdminLTE major
version.

## Executable dependency guards

`ThemeDependencyBoundaryTest` protects the direction of dependencies in all server-side layers:

- PHP outside concrete theme directories cannot reference `AdminLte`, `Tailwind` or `Legacy` theme subnamespaces;
- shared and feature Blade roots cannot refer to physical theme paths;
- frontend core module specifiers cannot point into `features` or `themes`.

`ViewBoundaryTest` walks every base Blade file and proves that each still
resolves through its original `sleeping_owl::default.*` logical name. The
Tailwind rendering contracts repeat that walk through the Shadcn namespace,
select the theme file when present and the base file otherwise, reject an
override identical to base, and prove that archived component prototypes are
not runtime-resolvable views.

The modern frontend ESLint config repeats the `core → features/themes` restriction through `no-restricted-imports`, so a new JavaScript violation fails at lint time before the wider PHPUnit architecture gate. Theme selection remains data-driven through `sleeping_owl.template`; adding a theme does not authorize a core import of its implementation.
