# Frontend bundle boundaries

## Transitional build topology

The modernization build publishes independent entrypoints while the existing UI continues to use the legacy bundle. This prevents an incomplete feature migration from changing runtime behavior.

| Logical id | JavaScript | Sass/CSS | Owner |
|---|---|---|---|
| `core` | `js/admin-core.js` | `css/admin-core.css` | framework-neutral runtime and shared primitives |
| `feature:forms` | `js/features/forms.js` | `css/features/forms.css` | form behavior independent of a concrete theme |
| `feature:table` | `js/features/table.js` | `css/features/table.css` | table registry and drivers independent of presentation |
| `theme:legacy-adminlte` | `js/themes/legacy-adminlte.js` | `css/themes/legacy-adminlte.css` | transitional AdminLTE 3/Bootstrap 4 presentation |
| `theme:tailwind` | `js/themes/tailwind.js` | `css/themes/tailwind.css` | Tailwind presentation |

The source/output mapping is declared once in `build/frontend-entries.json` and consumed by Laravel Mix. The same file is a build-time contract test fixture; it is not the future runtime/versioned asset manifest.

The new Sass entries currently declare only cascade-layer boundaries:

```text
sleepingowl-core < sleepingowl-feature < sleepingowl-theme
```

They intentionally do not import the legacy stylesheet. Core contains no reset, layout framework or feature/theme presentation. Feature and theme styles will move from the legacy tree only with characterization coverage.

## Legacy bridge

The following outputs remain available and unchanged during incremental migration:

- `css/admin-app.css`;
- `js/admin-app.js`;
- `js/admin-app-dev.js`;
- `js/vue.js`;
- `js/modules.js`.

`TemplateDefault` continues to load only these legacy assets until the versioned manifest resolver is implemented. A page must not load both the legacy aggregate and its migrated modern replacements once a feature is switched over, because that would initialize behavior twice.

## Dependency rules

- Core may import only core modules and third-party packages explicitly approved for core.
- Features may import core contracts but not concrete themes.
- Themes may import public core/feature contracts but features and core never import a concrete theme.
- No new entry may rely on an implicit global other than the transitional root `window.Admin` contract.
- Production and development profiles will map the same logical ids to different physical files; profile resolution belongs to the versioned manifest milestone, not to this build mapping.
