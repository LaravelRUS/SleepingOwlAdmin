# SleepingOwl Admin architecture

This document describes the current development branch. SleepingOwl Admin is a
Laravel package with a PHP-first CRUD/domain layer and a prebuilt,
theme-selectable frontend. Application code describes sections, displays and
forms; framework-specific markup and presentation remain in Blade and theme
assets.

## 1. Package lifecycle and container

Laravel discovers
`SleepingOwl\Admin\Providers\SleepingOwlServiceProvider` from `composer.json`.
During registration and boot the provider:

1. recursively merges `config/sleeping_owl.php` and merges navigation config;
2. registers the package and Shadcn Blade namespaces;
3. creates the central `Admin` service and registers package service providers;
4. registers factories, widgets, WYSIWYG, theme and asset services;
5. resolves the configured theme/template and initializes it for normal
   requests;
6. loads translations and exposes publishable config/assets in console mode.

Theme initialization is deliberately deferred for install/update commands and
before the first asset publication. This lets Composer package discovery and
`sleepingowl:install` recover a clean application that has no published manifest
yet.

`src/Admin.php` is the application-facing registry. It owns the collection of
model configurations and the current `TemplateInterface` adapter and exposes
navigation, meta, template and selected `ThemeInterface` services. The legacy
template surface remains for rendering/API compatibility; theme selection and
asset composition are handled by the dedicated theme layer.

The main providers are:

- `SleepingOwlServiceProvider`: package bootstrap, views, translations and
  publication;
- `AdminServiceProvider`: routes, commands, factories, theme/assets, widgets and
  initialization;
- `AliasesServiceProvider`: configured facades for the fluent public DSL;
- `BreadcrumbsServiceProvider`: breadcrumb integration;
- application `AdminSectionsServiceProvider`: model-to-section and policy
  registration.

## 2. Sections, models and repositories

The central mapping is an Eloquent model to a
`ModelConfigurationInterface` implementation.

- `Section` is the preferred class-based application API. A section defines
  `onDisplay()`, `onCreate()`, `onEdit()` and optional lifecycle/permission
  behavior.
- `ModelConfiguration` is the closure-configurable implementation retained for
  `AdminSection::registerModel()` compatibility.
- `ModelConfigurationManager` owns titles, aliases, controller selection,
  navigation integration, policies and CRUD callbacks.
- `ModelCollection` is the in-memory model configuration registry.
- `BaseRepository` and `TreeRepository` isolate Eloquent query/persistence
  operations needed by ordinary and tree displays.

The install command creates application-owned bootstrap files under the
configured `bootstrapDirectory` (`app/Admin` by default):

```text
app/Admin/
├── bootstrap.php
├── navigation.php
└── routes.php
```

It also creates `app/Providers/AdminSectionsServiceProvider.php`. Package updates
do not treat these application files as package-owned assets.

## 3. Routing and request handling

Package CRUD routes are declared in `src/Http/routes.php`. Application-specific
admin routes are loaded from `app/Admin/routes.php`.

`Routing/ModelRouter` registers route patterns and binds `{adminModel}` to the
matching model configuration. A section can replace the default controller with
`setControllerClass()`.

Request responsibilities are split across controllers:

- `AdminController`: standard display/create/edit/store/update/delete/restore
  lifecycle and page rendering;
- `DisplayController` and `DisplayColumnController`: display data and column
  endpoints, including inline editing;
- `FormElementController`: asynchronous form-element endpoints;
- `UploadController`: file/image and WYSIWYG uploads;
- `AlterPaginateDisplayController`: alternate async pagination flow.

Laravel Gates and section policies guard model actions. The former package ENV
editor has been removed: it has no routes, configuration surface or controller
methods.

## 4. Public UI DSL

`AliasBinder` powers the factory registries exposed through facades. The main
families are:

- `DisplayFactory`: sync tables, DataTables 3, tabs, trees and pages;
- `DisplayColumnFactory`: ordinary table columns;
- `DisplayColumnEditableFactory`: native inline/popup editable columns;
- `DisplayColumnFilterFactory`: text/select/date/range filters;
- `FormFactory`: base, elements-only, card and tabbed forms;
- `FormElementFactory`: fields, choices, uploads, editors, layout and related
  forms;
- `FormButtonsFactory`: save/cancel/delete/restore actions.

Aliases can be replaced or extended through the container/config without
changing package source. The factories create PHP objects; they do not select
Bootstrap, AdminLTE or Tailwind classes. Theme-specific classes are resolved in
Blade.

Displays own structural composition and server-side data behavior. Extensions
such as actions, links, column filters, totals and custom views implement the
placement system. DataTables-specific JavaScript is an adapter over the common
display contract rather than a separate PHP DSL.

Forms recursively initialize, validate and save elements, including supported
related-model forms. Public field names, validation rules, `_method`, CSRF and
`_redirectBack` remain server-owned contracts.

## 5. Rendering and Blade ownership

The canonical built-in Blade base is `resources/views/default`. It contains the
complete AdminLTE-compatible logical view contract. Shared feature views live in
`resources/views/features`.

The Shadcn theme uses ordered namespace hints; its intermediate package path is
present only when a real markup difference requires an override:

```text
application override
    -> resources/views/themes/shadcn/default (real differences only)
    -> resources/views/default (canonical base)
```

Application override paths are:

```text
AdminLTE: resources/views/vendor/sleeping_owl/default/<logical path>
Shadcn:   resources/views/vendor/sleeping_owl_shadcn/default/<logical path>
```

An absent Shadcn override is normal inheritance. Copying the complete base into
another theme or application is intentionally discouraged; override only markup
that differs.

Blade owns visible markup, framework classes, safe nesting, ARIA attributes and
presentation options passed to Vue islands. Feature JavaScript binds to stable
documented `data-*`, ARIA and field-name contracts. PHP core does not translate
semantic variants to framework classes.

## 6. Theme contract

`ThemeInterface` is intentionally small. A theme declares:

- its Blade namespace;
- unscoped logical asset requirements;
- theme-owned icon tokens;
- supported presentation capabilities.

The canonical theme name does not live in the theme class. It is the key in
`sleeping_owl.template.themes`, selected by `template.default`, and is passed to
the runtime/registry. The legacy class-string `template` shape is accepted only
as a migration fallback.

Built-in names are:

- `adminlte` → `AdminLTETheme` (AdminLTE 4 and Bootstrap 5);
- `shadcn` → `TailwindTheme` (ready Tailwind 4/Shadcn-inspired presentation).

`ThemeResolver` validates the selection and resolves only the selected class.
There is no silent fallback to AdminLTE when configuration is invalid.

`ThemeRegistry` allows a Composer package to register a lower-kebab theme name,
its `ThemeInterface`, a ready manifest and a public root. `registerPackage()`
expects a self-contained root with:

```text
asset-manifest.json
resources/{css,js,views}
public/profiles/{production,development}
```

External themes ship ready assets and their own Blade namespace. SleepingOwl
does not compile them or implicitly attach the built-in Blade base.

## 7. Frontend runtime and asset composition

The build matrix is `build/frontend-entries.json`. Logical entries separate
ownership and keep public paths independent from source layout. The current
matrix includes:

- `core`;
- `shared:compatibility`;
- `shared:modules`;
- `shared:vue`;
- `shared:ui`;
- `shared:features`;
- `shared:icons`;
- `theme:<name>`;
- optional `feature:<feature>:theme:<name>` adapters;
- `theme:<name>:overrides`, loaded last when present.

`ThemeRuntimeAssets` constructs the ordered style/script lists for the selected
theme. `LogicalAssetRegistrar` resolves those entries through
`AssetManifestResolver` and registers stable handles with the first-party asset
system. `AssetManifestRegistry` can add a selected external theme source without
allowing it to replace package-owned core or feature drivers.

Each distributable manifest contains matching `production` and `development`
profiles with content versions, MD5-compatible URL versions and SHA-256
checksums. Runtime selection uses `sleeping_owl.dev_assets`; it never invokes a
frontend compiler. `PublishedAssetVerifier` powers
`sleepingowl:update --check`.

The modern browser runtime consists of:

- framework-independent core utilities and registries;
- native DOM feature drivers for navigation, dropdowns, tabs, tooltips,
  messages, table actions, uploads and related controls;
- one shared Vue 3 runtime-only bundle for precompiled islands;
- DataTables 3 with selected-theme presentation adapters;
- a shared semantic CSS layer using `soa-*` hooks and canonical `--soa-*`
  custom properties.

jQuery, Vue 2 globals, global DataTable construction and X-editable are not part
of the modern selected-theme runtime. Compatibility markers such as
`data-toggle`, `data-dismiss` and `data-widget` remain where documented, but are
handled by package-owned native adapters.

## 8. Build and distribution boundary

Consumers install and update with Composer/PHP/Artisan only:

```bash
php artisan sleepingowl:update
php artisan sleepingowl:update --check
```

Maintainers currently build with Laravel Mix/Webpack. `webpack.mix.js` consumes
the build matrix, and `scripts/modernization/build-asset-profiles.mjs` builds and
reconciles both profiles. Tailwind is a maintainer-only build dependency for the
ready Shadcn theme. Migration from Mix to Vite is a separate post-release task,
not a consumer requirement.

Generated package files live under `public/default`; publication copies them to
`public/packages/sleepingowl/default`. Application-owned CSS, JavaScript and
views must remain outside that directory because `sleepingowl:update` replaces
it.

## 9. Extension boundaries

Supported extension mechanisms are:

- replace/register factory aliases;
- add application CSS/JS through `MetaInterface`;
- override individual Blade views in the documented namespace;
- listen for documented native lifecycle events and use public registries;
- register custom Vue 3 islands through `Admin.Vue`;
- ship a self-contained Composer theme through `ThemeRegistry`;
- generate starter code with `sleepingowl:extension:make`.

Application extensions must not depend on jQuery, global Vue/DataTable objects,
private files under `resources/js/shared`, or generated filenames in
`public/default`. Reusable code should depend on public PHP interfaces, logical
asset handles, documented DOM events/hooks and application-owned files.

## 10. Directory map

```text
build/                         # Source-to-logical-entry matrix
config/                        # Package defaults and navigation aliases
docs/modernization/            # Current contracts and migration guides
public/default/                # Generated distributable assets/manifests
resources/css/
  core/                        # Framework-independent base
  shared/                      # shared:ui and shared feature styles
  themes/                      # Built-in theme tokens/presentation
  theme-overrides/             # Minimal built-in corrections loaded last
resources/js/
  core/                        # Runtime primitives and registries
  shared/                      # Compatibility, Vue and feature drivers
  themes/                      # Theme-owned adapters
  theme-overrides/             # Minimal theme corrections
resources/views/
  default/                     # Canonical built-in Blade base
  features/                    # Shared feature-owned templates
  themes/shadcn/               # Real Shadcn differences only
src/
  Assets/                      # Manifest/resolution/publication
  Configuration/               # Normalized runtime configuration
  Console/                     # Install/update/generators
  Contracts/                   # Public interfaces
  Display/                     # Displays, columns, filters, extensions
  Factories/                   # AliasBinder factories
  Form/                        # Forms/elements/relations/buttons
  Http/                        # Controllers/routes/middleware
  Model/                       # Model configuration and collection
  Navigation/                  # Menu model
  Providers/                   # Laravel integration
  Repositories/                # Eloquent-backed data access
  Routing/                     # Dynamic model binding
  Templates/                   # Compatibility/rendering adapter
  Themes/                      # Theme selection and composition
  Widgets/                     # Widgets and message stack
  Wysiwyg/                     # Editor registry/adapters
tests/                         # PHP, Vitest and Playwright contracts
```

Further contracts are documented in:

- [`DOCUMENTATION.md`](DOCUMENTATION.md)
- [`docs/modernization/upgrade-guide.md`](docs/modernization/upgrade-guide.md)
- [`docs/modernization/theme-customization.md`](docs/modernization/theme-customization.md)
- [`docs/modernization/asset-manifest.md`](docs/modernization/asset-manifest.md)
- [`docs/modernization/table-feature-boundaries.md`](docs/modernization/table-feature-boundaries.md)
- [`docs/modernization/vue-runtime.md`](docs/modernization/vue-runtime.md)
