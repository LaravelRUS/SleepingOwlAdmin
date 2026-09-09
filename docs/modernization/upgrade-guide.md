# Major frontend upgrade guide

This guide covers the application-facing changes in the next SleepingOwlAdmin
major release. The package now requires PHP 8.1+ and Laravel 10–13 and ships all
standard frontend assets through Composer.

## Update without rebuilding the frontend

1. Update the Composer package.
2. Run `php artisan sleepingowl:update` to publish both ready asset profiles.
3. Run `php artisan sleepingowl:update --check` as a read-only deployment health check.
4. Keep the application's existing `config/sleeping_owl.php`; package defaults
   supply missing keys.
5. Clear or rebuild Laravel's config cache using the application's normal
   deployment process.
6. Review only application-owned Blade overrides and custom JavaScript.

`ADMIN_DEV_ASSETS=false` selects the minified production profile.
`ADMIN_DEV_ASSETS=true` selects the prebuilt development profile with source
maps and Vue diagnostics. Neither setting runs Node.js, npm, Mix or Vite.

If published files are missing or corrupt, the asset verifier reports the exact
`php artisan sleepingowl:update` recovery command. A valid but older manifest
continues to load and displays a localized warning in the AdminLTE footer.

## Preserved application contracts

- `AdminDisplay::datatables()`, columns, filters, actions and server-side
  processing remain the PHP table API.
- Existing route, auth, environment, upload, date/time, WYSIWYG, search and
  table configuration keys remain available.
- `sleeping_owl.template` remains the theme selector, now as
  `default` plus the `themes` name-to-class map. Old class-string values still
  resolve during migration; `TemplateDefault::class` uses the deprecated adapter.
- `sleeping_owl::default.*` view names and Laravel application override priority
  are preserved.
- Concrete theme classes and arbitrary HTML attributes still pass through; PHP
  does not translate classes between frameworks.

The published [config migration matrix](config-migration-matrix.md) lists the
few deprecated, implementation-changed and new keys. Do not replace the entire
application config with the package copy.

## JavaScript migration

jQuery, global Vue and global DataTable are removed. New code uses native DOM
and the public boundaries documented below:

| Previous extension | Replacement |
| --- | --- |
| jQuery DOM/events/Ajax | native DOM, bubbling `CustomEvent`, `Admin.Http` and `Admin.Components` |
| `$.fn.dataTable` or global DataTable access | `Admin.Tables`; vendor options stay behind `data-table-engine` |
| Vue 2 globals, `Vue.component`, `Vue.prototype`, `inline-template` | precompiled Vue 3 islands and `Admin.Vue` |
| jQuery Bootstrap/AdminLTE plugins | native feature drivers with existing compatibility `data-*` markers |
| direct global widget boot | register a module and use `Admin.Components.scan()` / `destroy()` lifecycle |

See [legacy JavaScript globals](legacy-javascript-globals.md),
[custom Vue islands](custom-vue-islands.md), [native events](native-events.md),
[component lifecycle](component-lifecycle.md) and
[DataTables option compatibility](data-table-options.md).

## AdminLTE and Blade overrides

The default theme uses AdminLTE 4 and Bootstrap 5. Review application overrides
against the exact class and markup table in the
[AdminLTE 4 migration](adminlte-4-migration.md). Package views retain historical
`data-toggle`, `data-dismiss` and `data-widget` markers beside current native
markers for a soft migration. Do not replace them with private prefixed hooks.

Views remain the owner of concrete classes. Override only the specific file
under `resources/views/vendor/sleeping_owl` that needs different markup; a full
view republish is unnecessary and makes future upgrades harder.

## Assets and themes

Direct `KodiCMS\Assets` facade imports must move to the package-owned facades
listed in [first-party assets](first-party-assets.md). Exact old facade strings
inside an existing published config are normalized automatically.

The default ready theme is `AdminLTETheme`. The package also includes the
framework-independent `TailwindTheme`; select its configured name without a
frontend rebuild:

```php
'template' => [
    'default' => 'shadcn',
    'themes' => [
        'adminlte' => SleepingOwl\Admin\Themes\AdminLTETheme::class,
        'shadcn' => SleepingOwl\Admin\Themes\TailwindTheme::class,
    ],
],
```

Its full Blade namespace, Tailwind 4 utility snapshot and production/development
assets are precompiled. Application overrides may reuse shipped utilities or
own a separate application Tailwind build for new arbitrary utilities. A ready
external theme may register its own Blade views and manifest fragment through
`ThemeRegistry`. Application CSS/JS, supported `--soa-*` properties, the sidebar
background and Blade overrides require no package rebuild. See the
[Tailwind theme](tailwind-theme.md) and
[theme customization guide](theme-customization.md) for complete examples.

## Application verification

After updating, verify login/layout/footer, sidebar and color mode, synchronous
and server-side tables, filters/actions, forms and validation, uploads, editors,
tree operations and any overridden Blade views. Use the development asset
profile while adapting custom modules, then return production deployments to
`ADMIN_DEV_ASSETS=false`.

## Extension scaffolds

The package can generate maintained starting points without copying internal
classes or old jQuery/Vue globals:

```bash
php artisan sleepingowl:extension:make form-element PriceInput
php artisan sleepingowl:extension:make widget PendingOrders
php artisan sleepingowl:extension:make policy OrderSectionPolicy
php artisan sleepingowl:extension:make module-provider OrdersAdminServiceProvider
php artisan sleepingowl:extension:make vue-island order-status
php artisan sleepingowl:extension:make theme AcmeTheme
```

PHP-only extensions need no frontend build. The Vue island scaffold uses
`Admin.Vue.runtime` and `Admin.Vue.register()` rather than bundling or publishing
a global Vue copy. A generated theme is an explicit contract skeleton: add its
Blade namespace and ready production/development manifest before selecting it.
Existing files are never overwritten unless `--force` is supplied.
