# Blade view boundaries

## Ownership roots

| Root | Owner | Allowed responsibility |
| --- | --- | --- |
| `resources/views/shared` | UI core | Theme-independent composition and minimal semantic HTML with no feature lifecycle or CSS-framework classes |
| `resources/views/features` | Named feature | Feature behavior, protocol responses and theme-neutral feature markup |
| `resources/views/default` | Legacy default theme | AdminLTE/Bootstrap layout, presentation markup and feature presentation adapters |

`sleeping_owl::default.*` remains the compatibility namespace used by `TemplateDefault` and existing custom templates. When a historical path now belongs to `shared` or `features`, the file under `default` is kept as a one-line bridge include. This preserves published view overrides and PHP view names while moving the implementation to its real owner.

## Dependency direction

- A shared view must not depend on a theme, feature lifecycle, config-driven widget behavior, inline JavaScript or Vue directives.
- A feature view may use shared views and first-party support classes, but must not include `default` theme views or resolve views through `AdminTemplate`.
- A theme view may compose shared views, feature views and theme-local presentation partials.
- Bootstrap/AdminLTE classes stay in `default` until that directory is extracted as the explicit legacy AdminLTE theme.
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
