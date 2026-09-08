# Frontend bundle boundaries

## Published build topology

The modernization build publishes independent entrypoints for the default `AdminLTETheme`. The deprecated `TemplateDefault` keeps a separate legacy aggregate for old published configuration; a page uses one path or the other and never mixes them.

| Logical id | JavaScript | Sass/CSS | Owner |
|---|---|---|---|
| `core` | `js/admin-core.js` | `css/admin-core.css` | framework-neutral runtime and shared primitives |
| `shared:icons` | — | `css/icons.css` | common Font Awesome presentation shared by themes |
| `shared:compatibility` | `js/shared/compatibility.js` | — | bounded legacy `Admin.*`, translation and notification services without jQuery/Bootstrap/AdminLTE |
| `shared:vue` | `js/shared/vue.js` | — | Vue 3 runtime, precompiled package islands and public extension API |
| `shared:modules` | `js/shared/modules.js` | — | final compatibility module boot and idempotent component scan |
| `feature:forms` | `js/features/forms.js` | `css/features/forms.css` | form behavior independent of a concrete theme |
| `feature:table` | `js/features/table.js` | `css/features/table.css` | table registry and drivers independent of presentation |
| `feature:table:theme:legacy-adminlte` | `js/features/table/themes/legacy-adminlte.js` | `css/features/table/themes/datatables-legacy-adminlte.css` | Bootstrap 5/DataTables presentation owned by the AdminLTE table adapter |
| `feature:table:theme:tailwind` | — | `css/features/table/themes/tailwind.css` | standalone Tailwind-oriented DataTables presentation without a Tailwind CLI runtime |
| `theme:legacy-adminlte` | `js/themes/legacy-adminlte.js` | `css/themes/legacy-adminlte.css` | AdminLTE 4/Bootstrap 5 presentation; the logical id remains stable for compatibility |
| `theme:tailwind` | `js/themes/tailwind.js` | `css/themes/tailwind.css` | Tailwind presentation |

The source/output mapping is declared once in `build/frontend-entries.json` and consumed by Laravel Mix. The same file is a build-time contract; after compilation it generates `public/default/asset-manifest.json`, which maps logical ids to validated runtime files, content versions and SHA-256 checksums. The schema and PHP resolver are documented in `asset-manifest.md`.

DataTables behavior, engine and public table tokens remain in `feature:table`. Concrete wrapper,
control, pagination, responsive and auto-update presentation lives in
`feature:table:theme:<theme-id>`. The legacy AdminLTE aggregate includes the same owner-local
AdminLTE adapter without a layer while the modern entry wraps it in `sleepingowl-theme.table`;
the Tailwind adapter is precompiled Sass and does not require Tailwind, PostCSS or Node.js in a
consumer project.

The new Sass entries declare cascade-layer boundaries:

```text
sleepingowl-core < sleepingowl-feature < sleepingowl-theme
```

They intentionally do not import the legacy stylesheet. Core contains no reset, layout framework or feature/theme presentation. Feature and theme styles move from the legacy tree only with characterization coverage.

The JavaScript core has a dedicated browser entry. Loading the production or development
`admin-core.js` installs the same narrow services on the existing `Admin` object without replacing
already installed adapters: `Asset`, `Components`, `Data`, `DOM`, `Events`, `Http`, `Storage` and
`Tables`. The package's pure `core/index.js` remains the import boundary for feature and theme
sources. This split keeps tests and source imports side-effect free while preventing production
tree-shaking from turning the published browser entry into an empty file.

`Http` is a native Fetch wrapper with same-origin credentials, `X-Requested-With`, CSRF metadata
for mutation methods and typed non-success errors. `Storage` preserves the existing
`SleepingOwl::` prefix and scalar/object/array API without lodash, and its `clear()` removes only
owned keys. Neither service contains feature transport or presentation behavior.

Every Sass entry loads sibling `_variables.scss`, `_colors.scss` and `_custom-properties.scss` modules through `@use`. Variables are local to their owner and use `!default`, so maintainers and external theme authors can configure a source build without cross-bundle globals. Color values live in `_colors.scss`; dimensions, typography, spacing and motion live in `_variables.scss`. Core intentionally has no palette: its `_colors.scss` documents that boundary, while the selected theme supplies text, surface, focus and typography properties. Core CSS contains only cloak/loading/reduced-motion and visually-hidden behavior. The supported runtime/no-build subset is emitted under `:root` as public `--soa-*` custom properties. Dark values are property-only overrides on `:root[data-color-scheme="dark"]`; the detailed contract is documented in `runtime-theme-properties.md`.

The former handwritten `resources/assets/scss/css/files.css` is split into owner-local form feature partials. A parameterized `files.styles(...)` mixin lets both the legacy aggregate and modern forms entry emit the same stable selectors while taking colors from their own `_colors.scss`. No handwritten plain CSS remains under `resources`; generated and vendor directories are explicit exceptions and are never edited as first-party Sass.

## Legacy bridge

The following outputs remain available and unchanged during incremental migration:

- `css/admin-app.css`;
- `js/admin-app.js`;
- `js/admin-app-dev.js`;
- `js/vue.js`;
- `js/modules.js`.

Only the deprecated `TemplateDefault` loads these files. The direct `AdminLTETheme` resolves the selected manifest profile as `core → shared entries → theme → features/adapters → shared:modules`; it does not request `admin-app.js`, `vue.js` or `modules.js`. A page must not load both paths because that would initialize behavior twice.

The logical registrar preserves the public handles used by existing projects. `admin-vue-init` follows `shared:vue`; `admin-default` follows the complete AdminLTE theme/feature runtime; `admin-modules-load` is the final `shared:modules` entry. A project asset depending on `admin-default` therefore executes after all standard drivers but before `Admin.Modules.boot()`, so existing custom module registration keeps working without a consumer rebuild.

## Dependency rules

- Core may import only core modules and third-party packages explicitly approved for core.
- Features may import core contracts but not concrete themes.
- Themes may import public core/feature contracts but features and core never import a concrete theme.
- No new entry may rely on an implicit global other than the transitional root `window.Admin` contract.
- Production and development map the same logical ids to isolated files under `profiles/<profile>`. `ADMIN_DEV_ASSETS` selects one complete profile; development files include external source maps while production files are minified and contain no source map reference.
