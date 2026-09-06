# Blade view boundaries

## Ownership roots

| Root | Owner | Allowed responsibility |
| --- | --- | --- |
| `resources/views/shared` | UI core | Theme-independent composition and minimal semantic HTML with no feature lifecycle or CSS-framework classes |
| `resources/views/features` | Named feature | Feature behavior, protocol responses and theme-neutral feature markup |
| `resources/views/themes/legacy/default` | Legacy default theme | AdminLTE 3/Bootstrap 4 layout, presentation markup and feature presentation adapters |

`sleeping_owl::default.*` remains the compatibility namespace used by `TemplateDefault` and existing custom templates. Laravel receives both the package view root and `resources/views/themes/legacy` as hints for the same `sleeping_owl` namespace. Application overrides keep the highest priority, while `default.*` resolves from the extracted legacy theme without changing its logical name.

When a historical path now belongs to `shared` or `features`, its file inside the legacy theme is kept as a one-line bridge include. This preserves published view overrides and PHP view names while moving the implementation to its real owner.

## Dependency direction

- A shared view must not depend on a theme, feature lifecycle, config-driven widget behavior, inline JavaScript or Vue directives.
- A feature view may use shared views and first-party support classes, but must not include `default` theme views or resolve views through `AdminTemplate`.
- A theme view may compose shared views, feature views and theme-local presentation partials.
- Bootstrap/AdminLTE classes belong only to `themes/legacy/default`; shared and feature implementations cannot acquire them through an implicit fallback.
- A feature view that still needs framework classes remains a theme-owned feature presentation adapter; it is not moved into `features` merely because its PHP class belongs to a feature.
- New cross-layer includes use explicit `sleeping_owl::shared.*` or `sleeping_owl::features.*` paths. No implicit fallback or semantic class resolver is introduced.

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

## Extracted legacy AdminLTE theme

The current compatibility implementation is explicitly identified as `legacy-adminlte` through `ThemeInterface`. Its ownership boundary is:

- template selector and lifecycle: `SleepingOwl\Admin\Templates\TemplateDefault`;
- Blade implementation: `resources/views/themes/legacy/default`;
- stable logical namespace: `sleeping_owl::default`;
- current precompiled distribution: `public/default`;
- transitional source tree: `resources/assets`, to be split into core/features/themes during the asset-bundle stage.

The physical view move does not change logical view names, template config, published override priority or public asset URLs. Moving or rebuilding the legacy asset tree is deliberately deferred until versioned manifests and independent bundles exist, so this extraction does not create a half-migrated runtime.

## Executable dependency guards

`ThemeDependencyBoundaryTest` protects the direction of dependencies in all server-side layers:

- PHP outside concrete theme directories cannot reference `AdminLte`, `Tailwind` or `Legacy` theme subnamespaces;
- shared and feature Blade roots cannot refer to physical theme paths;
- frontend core module specifiers cannot point into `features` or `themes`.

The modern frontend ESLint config repeats the `core → features/themes` restriction through `no-restricted-imports`, so a new JavaScript violation fails at lint time before the wider PHPUnit architecture gate. Theme selection remains data-driven through `sleeping_owl.template`; adding a theme does not authorize a core import of its implementation.
