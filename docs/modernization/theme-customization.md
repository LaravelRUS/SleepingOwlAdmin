# No-build theme customization

## Consumer contract

An application may select a ready theme, change the supported theme settings, add ordinary CSS or JavaScript, and override Blade views without rebuilding SleepingOwl core or a theme bundle. Keep application-owned files outside `public/packages/sleepingowl`: `php artisan sleepingowl:update` replaces that package-owned directory.

The normal production workflow is Composer plus PHP/Artisan. Node.js is needed only by maintainers and authors who build a distributable theme package.

## Select a theme and pass settings

Select a theme by its configured name:

```php
use Vendor\AdminTheme\AcmeTheme;

return [
    'template' => [
        'default' => 'acme',
        'themes' => [
            'acme' => AcmeTheme::class,
        ],
    ],
];
```

`AcmeTheme` implements `SleepingOwl\Admin\Contracts\Theme\ThemeInterface`. Only
the class selected by `template.default` is resolved. An invalid name, class,
capability or logical asset fails with a diagnostic exception; the resolver
never falls back to AdminLTE.

The resolver still accepts the former `'template' => AcmeTheme::class` shape
as a migration fallback. The current package config publishes only the named
`default`/`themes` shape.

`ThemeConfiguration` gives theme views the following configuration values under their canonical names and types:

| Setting | Intended presentation use |
| --- | --- |
| `body_default_class` | Concrete body classes for the selected theme |
| `breadcrumbs` | Show or hide breadcrumbs |
| `favicon` | Favicon URL |
| `footer_text`, `show_footer`, `show_version`, `version_text` | Footer content and visibility |
| `logo`, `logo_mini`, `menu_top` | Header/sidebar branding and menu label |
| `show_color_mode_toggle` | Show the light/dark mode control |
| `sidebar_background_color` | Validated runtime `--soa-sidebar-bg`; `null` keeps the theme default |
| `useHasManyLocalCard`, `useRelationCard`, `useWysiwygCard` | Existing card presentation switches |

Blade views created through the selected template receive `$theme`, `$themeConfig`, `$assetHealthStatus` and the legacy `$template`. A theme reads a value with `$themeConfig->get('footer_text')`. Values are not renamed or converted to framework classes. Concrete markup and classes remain in Blade.

Set these values in `config/sleeping_owl.php` or during a provider's `register()` method, before the selected theme is resolved. After changing cached configuration, use the application's normal `config:clear`/`config:cache` deployment flow; no frontend build is involved.

## Add application CSS and JavaScript

The existing `MetaInterface` is the public URL-based asset API. Register application files after the package runtime has initialized so they are appended after the selected theme and feature adapters:

```php
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;

final class AdminPresentationServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->booted(function (Application $app): void {
            $meta = $app->make(MetaInterface::class);
            $meta->addCss('project-admin', asset('css/admin.css'));
            $meta->addJs('project-admin', asset('js/admin.js'));
        });
    }
}
```

`addJs()` places a script in the footer by default. Its fifth argument and the fourth `addCss()` argument accept HTML attributes. Handles are application-owned; registering the same handle again replaces the earlier URL. Dependencies may be a handle or a list of handles.

For the current AdminLTE theme, the compatibility handles remain stable:

```php
use SleepingOwl\Admin\Facades\Meta;

Meta::addCss('project-admin', asset('css/admin.css'), 'admin-default');
Meta::addJs('project-admin', asset('js/admin.js'), 'admin-modules-load');
```

The first form is theme-independent and is preferred in a service provider. The compatibility handles are useful in existing admin bootstrap files and are not a promise that another theme exposes AdminLTE's handles. Custom JavaScript should use the documented native events and registries instead of jQuery, Bootstrap/AdminLTE globals, global Vue or global DataTable.

Blade assets may also use `@push('scripts')` for head markup and `@push('footer-scripts')` for footer markup. Use the asset API for reusable files because it deduplicates handles and preserves dependency ordering.

## Override supported CSS properties

Put overrides in the application stylesheet loaded above. Use `:root` for both modes and the root attribute for a dark-only value:

```css
:root {
    --soa-primary-color: #2457d6;
    --soa-content-padding: 1.25rem;
    --soa-sidebar-bg: #102030;
    --soa-table-row-selected-color: #dbeafe;
}

:root[data-color-scheme='dark'] {
    --soa-sidebar-bg: #081018;
    --soa-table-row-selected-color: #17345f;
}
```

The following properties are the supported AdminLTE/core/feature runtime surface at this checkpoint. A property is effective when its owning feature and adapter are loaded.

- Core behavior: `--soa-focus-ring-width`, `--soa-motion-duration-fast`, `--soa-motion-duration-normal`.
- Shared AdminLTE palette/layout: `--soa-primary-color`, `--soa-danger-color`, `--soa-surface-color`, `--soa-page-background-color`, `--soa-text-color`, `--soa-muted-text-color`, `--soa-border-color`, `--soa-focus-color`, `--soa-font-family-sans`, `--soa-font-family-monospace`, `--soa-font-size-base`, `--soa-line-height-base`, `--soa-sidebar-bg`, `--soa-sidebar-text-color`, `--soa-sidebar-width`, `--soa-sidebar-collapsed-width`, `--soa-content-padding`, `--soa-border-radius`, `--soa-layout-transition-duration`.
- Shared semantic UI: `--soa-elevated-surface-color`, `--soa-muted-surface-color`, `--soa-input-border-color`, `--soa-on-primary-color`, `--soa-success-color`, `--soa-warning-color`, `--soa-info-color`, `--soa-overlay-color`, `--soa-shadow-sm`, `--soa-shadow-md`, `--soa-border-width`, `--soa-border-radius-lg`, `--soa-border-radius-full`, `--soa-disabled-opacity`, `--soa-font-size-caption`, `--soa-font-size-section`, `--soa-font-size-title`, `--soa-font-weight-medium`, `--soa-font-weight-semibold`, `--soa-line-height-tight`, `--soa-space-1`, `--soa-space-2`, `--soa-space-3`, `--soa-space-4`, `--soa-space-6`, `--soa-header-height`, `--soa-header-action-size`, `--soa-header-z-index`, `--soa-overlay-z-index`, `--soa-shell-max-width`, `--soa-content-padding-compact`, `--soa-sidebar-border-color`, `--soa-control-size`, `--soa-control-size-sm`, `--soa-icon-control-size`, `--soa-control-padding-block`, `--soa-control-padding-inline`, `--soa-control-padding-block-sm`, `--soa-control-padding-inline-sm`, `--soa-choice-size`, `--soa-switch-track-padding`, `--soa-attachment-empty-min-height`, `--soa-attachment-preview-ratio`, `--soa-order-badge-size`, `--soa-dragging-opacity`, `--soa-dialog-image-reserved-space`, `--soa-scroll-control-size`, `--soa-scroll-control-offset-inline`, `--soa-scroll-control-offset-block`, `--soa-scroll-control-z-index`.
- Asset-health footer: `--soa-asset-health-surface-color`, `--soa-asset-health-text-color`, `--soa-asset-health-border-color`, `--soa-asset-health-gap`, `--soa-asset-health-margin-top`, `--soa-asset-health-padding-block`, `--soa-asset-health-padding-inline`, `--soa-asset-health-border-width`.
- Dropdown: `--soa-dropdown-surface`, `--soa-dropdown-text`, `--soa-dropdown-z-index`, `--soa-dropdown-border`, `--soa-dropdown-hover-surface`, `--soa-dropdown-focus`, `--soa-dropdown-min-width`, `--soa-dropdown-offset`, `--soa-dropdown-padding-block`, `--soa-dropdown-padding-inline`, `--soa-dropdown-item-padding-block`, `--soa-dropdown-item-padding-inline`, `--soa-dropdown-border-width`, `--soa-dropdown-radius`, `--soa-dropdown-font-size`, `--soa-dropdown-line-height`, `--soa-dropdown-focus-width`, `--soa-dropdown-shadow`.
- Forms/date/file: `--soa-form-control-text-color`, `--soa-form-control-placeholder-color`, `--soa-form-control-surface-color`, `--soa-form-control-border-color`, `--soa-form-control-focus-color`, `--soa-form-control-invalid-color`, `--soa-form-control-min-height`, `--soa-form-control-padding-block`, `--soa-form-control-padding-inline`, `--soa-form-control-border-width`, `--soa-form-control-border-radius`, `--soa-form-control-transition-duration`, `--soa-form-file-thumbnail-border-color`, `--soa-form-file-thumbnail-surface-color`, `--soa-form-file-name-color`, `--soa-form-date-picker-surface-color`, `--soa-form-date-picker-hover-color`, `--soa-form-date-picker-active-color`, `--soa-form-date-picker-text-color`, `--soa-form-date-picker-muted-color`, `--soa-form-date-picker-accent-color`, `--soa-form-date-picker-border-color`, `--soa-form-date-picker-other-month-color`, `--soa-form-date-picker-disabled-color`, `--soa-form-date-picker-selected-color`, `--soa-form-date-picker-selected-hover-color`, `--soa-form-date-picker-selected-text-color`, `--soa-form-date-picker-range-color`, `--soa-form-date-picker-range-focus-color`, `--soa-form-date-picker-shadow-color`.
- Shared form geometry/states: `--soa-form-field-gap`, `--soa-form-gap`, `--soa-form-grid-gap`, `--soa-form-textarea-min-height`, `--soa-form-attachment-min-width`, `--soa-form-dialog-max-width`, `--soa-form-spinner-size`, `--soa-form-switch-width`, `--soa-form-switch-height`, `--soa-progress-size`, `--soa-spinner-duration`, `--soa-spinner-border-width`, `--soa-skeleton-duration`, `--soa-skeleton-min-size`, `--soa-skeleton-opacity`.
- Sidebar: `--soa-sidebar-transition-duration`, `--soa-sidebar-link-hover-bg`, `--soa-sidebar-link-active-bg`, `--soa-sidebar-link-active-text`, `--soa-sidebar-submenu-bg`, `--soa-sidebar-overlay-bg`, `--soa-sidebar-z-index`, `--soa-sidebar-overlay-z-index`, `--soa-sidebar-indicator-angle` in addition to the shared sidebar properties above.
- Table and inline editor: `--soa-table-text-color`, `--soa-table-surface-color`, `--soa-table-border-color`, `--soa-table-row-hover-color`, `--soa-table-row-selected-color`, `--soa-table-cell-padding-block`, `--soa-table-cell-padding-inline`, `--soa-table-border-width`, `--soa-table-row-transition-duration`, `--soa-inline-editor-surface`, `--soa-inline-editor-text`, `--soa-inline-editor-border`, `--soa-inline-editor-accent`, `--soa-inline-editor-accent-hover`, `--soa-inline-editor-on-accent`, `--soa-inline-editor-muted`, `--soa-inline-editor-error`, `--soa-inline-editor-shadow`, `--soa-inline-editor-backdrop`, `--soa-inline-editor-focus-ring`.
- Tabs: `--soa-tabs-text`, `--soa-tabs-active-text`, `--soa-tabs-active-surface`, `--soa-tabs-border`, `--soa-tabs-focus`, `--soa-tabs-gap`, `--soa-tabs-padding-block`, `--soa-tabs-padding-inline`, `--soa-tabs-border-width`, `--soa-tabs-radius`, `--soa-tabs-focus-width`.
- Tooltip: `--soa-tooltip-max-width`, `--soa-tooltip-z-index`, `--soa-tooltip-surface`, `--soa-tooltip-text`, `--soa-tooltip-padding-block`, `--soa-tooltip-padding-inline`, `--soa-tooltip-radius`, `--soa-tooltip-font-size`, `--soa-tooltip-line-height`, `--soa-tooltip-shadow`.
- Lightbox: `--soa-lightbox-backdrop`, `--soa-lightbox-backdrop-opacity`, `--soa-lightbox-svg-min-size`, `--soa-lightbox-control-surface`, `--soa-lightbox-control-surface-hover`, `--soa-lightbox-control-text`, `--soa-lightbox-caption-surface`, `--soa-lightbox-caption-text`, `--soa-lightbox-control-size`, `--soa-lightbox-control-radius`, `--soa-lightbox-caption-radius`, `--soa-lightbox-transition-duration`.
- Tree: `--soa-tree-empty-target-color`, `--soa-tree-empty-target-size`, `--soa-tree-surface`, `--soa-tree-text`, `--soa-tree-border`, `--soa-tree-handle`, `--soa-tree-handle-hover`, `--soa-tree-hover`, `--soa-tree-ghost`, `--soa-tree-on-handle`, `--soa-tree-shadow`, `--soa-tree-indent`, `--soa-tree-item-gap`, `--soa-tree-content-padding-block`, `--soa-tree-content-padding-inline`, `--soa-tree-control-size`, `--soa-tree-control-gap`, `--soa-tree-menu-gap`, `--soa-tree-border-width`, `--soa-tree-radius`, `--soa-tree-transition-duration`, `--soa-tree-ghost-opacity`, `--soa-tree-shadow-offset`, `--soa-tree-shadow-blur`.

`--soa-datatables-autoupdate-color` and `--soa-inline-editable-max-rows` are component-local values emitted from validated PHP/component state. Do not set them globally unless every instance should receive the same value.

Only `sidebar_background_color` is currently accepted as a PHP config-to-CSS mapping and validated by `CssColor`. There is intentionally no arbitrary `css_variables` PHP map: application CSS owns general overrides and avoids injecting unvalidated CSS into Blade.

## Register an external theme package

An external package supplies a `ThemeInterface`, namespaced Blade views, already-built production/development files and a manifest fragment. Its provider registers the fragment during the Laravel registration phase:

Every selected theme receives SleepingOwl's `shared:ui` exactly once and the
declared `shared:features` bundle supplies feature geometry such as the inline
editor. The external theme provides token values and genuine presentation
differences; it does not copy or compile either shared semantic layer. In
particular, custom inline-editor skins should set the documented
inline-editor token values instead of copying the shared `soa-inline-*`
selectors.

```php
use SleepingOwl\Admin\Themes\ThemeRegistry;
use Vendor\AdminTheme\AcmeTheme;

public function register(): void
{
    $this->app->afterResolving(ThemeRegistry::class, function (ThemeRegistry $themes): void {
        $themes->registerPackage(
            'acme',
            AcmeTheme::class,
            __DIR__.'/..',
            'vendor/acme/sleepingowl-theme'
        );
    });
}
```

`afterResolving()` makes the hook independent of Composer provider discovery order while still running before theme selection. Set `template.default` to `acme`; the name may be provided by the registry without copying the class into the application's theme map. Registering a duplicate canonical name, or configuring that name for another class, fails explicitly.

The registered root is self-contained: it owns `asset-manifest.json`, `resources/{css,js,views}` and ready `public/profiles/{production,development}` files. The package provider separately calls `loadViewsFrom()` and publishes only its `public` directory to the URL root passed to `registerPackage()`. File names inside the manifest are relative to that public root. SleepingOwl never copies theme sources into the package and does not compile external assets with `sleepingowl:update`.

The fragment uses the core manifest schema but does not contain `core` or package feature-driver entries. It must contain both `production` and `development`, with identical logical ids in the same order. `theme:acme` is generated from the registry name. Every optional adapter is declared without repeating that name in `AcmeTheme::assets()` (for example `feature:table`) and is scoped in the ready fragment:

```text
theme:acme
feature:table:theme:acme
feature:tooltip:theme:acme
theme:acme:overrides
```

Declare the last entry as `theme:overrides` only when the package actually ships a minimal correction layer.

Shared entries are allowed only when declared by the theme. Core resolves unchanged `core`, `shared:features` and existing shared infrastructure from SleepingOwl's own manifest; the external fragment supplies only its ready theme/shared/optional adapter files. A mismatched profile, undeclared entry, foreign theme name, invalid path or checksum metadata fails registration. No assets from another theme are loaded as fallback.

## Blade overrides

The built-in themes keep separate application namespaces:

```text
AdminLTE: resources/views/vendor/sleeping_owl/default/<logical path>
Shadcn:   resources/views/vendor/sleeping_owl_shadcn/default/<logical path>
Tabler:   resources/views/vendor/sleeping_owl_tabler/default/<logical path>
```

AdminLTE resolves the application file and then the complete package base in
`resources/views/default`. Shadcn and Tabler resolve application, then their
sparse theme path, then that same base. Do not copy the
whole package view base into an application or theme: override only the files whose
markup differs. An absent built-in override is normal inheritance.

External themes use their own namespace and may document a matching
application override path. SleepingOwl does not attach the built-in base to an
external namespace implicitly. Keep documented behavior markers and
ARIA/field names; `data-toggle`, `data-dismiss` and `data-widget` remain
compatibility markers. Do not introduce `data-soa-*`. Concrete classes and safe
nesting belong to Blade, and PHP does not translate semantic variants into
framework classes.

## TailwindTheme utilities in application views

The built-in TailwindTheme works without Node.js. Select its configured name
and use the committed production/development CSS:

```php
'template' => [
    'default' => 'shadcn',
    'themes' => [
        'adminlte' => SleepingOwl\Admin\Themes\AdminLTETheme::class,
        'shadcn' => SleepingOwl\Admin\Themes\TailwindTheme::class,
    ],
],
```

The precompiled utility snapshot scans package views only. An override in
`resources/views/vendor/sleeping_owl_shadcn` may freely reuse utilities that
already exist in that snapshot. If it introduces an arbitrary or previously
unused utility, the application owns a small extra Tailwind build; it does not
rebuild package core or overwrite `public/packages/sleepingowl`.

An application build can reuse the shipped canonical-token preset:

```js
// tailwind.admin.config.js
const preset = require('./vendor/laravelrus/sleepingowl/resources/css/themes/shadcn/tailwind.preset.cjs')

module.exports = {
    content: ['./resources/views/vendor/sleeping_owl_shadcn/**/*.blade.php'],
    presets: [preset],
}
```

```css
/* resources/css/admin-tailwind.css */
@import 'tailwindcss/utilities.css' layer(utilities) source(none);
@config '../../tailwind.admin.config.js';
@source '../views/vendor/sleeping_owl_shadcn';
```

Compile that file with the application's own Tailwind 4/PostCSS toolchain and
register the result through `MetaInterface` after the selected theme. Simple
branding, spacing, colors and component adjustments should use application CSS
and documented `--soa-*` properties instead; those changes require no Node.js.
