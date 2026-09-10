# Frontend bundle boundaries

## Published build topology

The modernization build publishes independent entrypoints for the default `AdminLTETheme`. The deprecated `TemplateDefault` keeps a separate legacy aggregate for old published configuration; a page uses one path or the other and never mixes them.

| Logical id | JavaScript | Sass/CSS | Owner |
|---|---|---|---|
| `core` | `js/admin-core.js` | `css/admin-core.css` | framework-neutral runtime and shared primitives |
| `shared:icons` | — | `css/icons.css` | common Font Awesome presentation shared by themes |
| `shared:compatibility` | `js/shared/compatibility.js` | — | bounded legacy `Admin.*`, translation and notification services without jQuery/Bootstrap/AdminLTE |
| `shared:vue` | `js/shared/vue.js` | — | Vue 3 runtime, precompiled package islands and public extension API |
| `shared:features` | `js/shared/features.js` | `css/shared/features.css` | all feature drivers and theme-neutral feature presentation that the runtime always loads together |
| `shared:modules` | `js/shared/modules.js` | — | final compatibility module boot and idempotent component scan |
| `theme:adminlte` | `js/themes/adminlte.js` | `css/themes/adminlte.css` | AdminLTE/Bootstrap presentation and all AdminLTE feature adapters |
| `theme:tabler` | — | `css/themes/tabler.css` | exact Tabler 1.5.1 CSS and Tabler-specific token/component presentation; no vendor runtime |
| `theme:tailwind` | — | `css/themes/tailwind.css` | exact Tailwind CSS 4.3.3 output and Tailwind-owned token/component presentation; no theme runtime |

The source/output mapping is declared once in `build/frontend-entries.json` and consumed by Vite. The same file is a build-time contract; after compilation it generates `public/default/asset-manifest.json`, which maps logical ids to validated runtime files, content versions and SHA-256 checksums. The schema and PHP resolver are documented in `asset-manifest.md`.

Feature source folders remain ownership boundaries: table behavior cannot import a concrete theme,
and theme adapters remain under `resources/{css,js}/themes/<theme>/features`. They are aggregated
only at the public build boundary. This keeps source responsibilities visible without paying for a
request and manifest record for every small partial.

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

Leaf Sass owners load their local token and presentation modules through `@use`. The public `shared:features` and theme entrypoints are thin aggregators and do not invent another token layer. Variables stay local to their owner and use `!default`, so maintainers and external theme authors can configure a source build without cross-bundle globals. Core intentionally has no palette, while the selected theme supplies text, surface, focus and typography properties. The supported runtime/no-build subset is emitted under `:root` as public `--soa-*` custom properties. Dark values are property-only overrides on `:root[data-color-scheme="dark"]`; the detailed contract is documented in `runtime-theme-properties.md`.

The former handwritten `resources/css/themes/adminlte/legacy/css/files.css` is owned by one consolidated form file module. A parameterized `files.styles(...)` mixin lets both the legacy aggregate and modern forms entry emit the same stable selectors, while the shared `_tokens.scss` owns their common runtime properties. No handwritten plain CSS remains under `resources`; generated and vendor directories are explicit exceptions and are never edited as first-party Sass.

## Legacy bridge

The following outputs remain available and unchanged during incremental migration:

- `css/admin-app.css`;
- `js/admin-app.js`;
- `js/admin-app-dev.js`;
- `js/vue.js`;
- `js/modules.js`.

Only the deprecated `TemplateDefault` loads these files. The direct `AdminLTETheme` resolves the selected manifest profile as `core → shared infrastructure → theme → shared:features → external adapters → shared:modules`; it does not request `admin-app.js`, `vue.js` or `modules.js`. A page must not load both paths because that would initialize behavior twice.

The logical registrar preserves the public handles used by existing projects. `admin-vue-init` follows `shared:vue`; `admin-default` follows the complete AdminLTE theme/feature runtime; `admin-modules-load` is the final `shared:modules` entry. A project asset depending on `admin-default` therefore executes after all standard drivers but before `Admin.Modules.boot()`, so existing custom module registration keeps working without a consumer rebuild.

Laravel remains the source of translated UI strings. `shared:compatibility` exposes the historical
`trans(key, parameters)` function through a small package-owned dot-notation resolver; neither
`i18next` nor a Vue-specific i18n runtime is shipped for this server-provided translation map.

## Dependency rules

- Core may import only core modules and third-party packages explicitly approved for core.
- Features may import core contracts but not concrete themes.
- Themes may import public core/feature contracts but features and core never import a concrete theme.
- No new entry may rely on an implicit global other than the transitional root `window.Admin` contract.
- Production and development map the same logical ids to isolated files under `profiles/<profile>`. `ADMIN_DEV_ASSETS` selects one complete profile; development files include external source maps while production files are minified and contain no source map reference.
