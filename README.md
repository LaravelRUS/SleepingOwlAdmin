# SleepingOwl Admin

[![Tests](https://github.com/LaravelRUS/SleepingOwlAdmin/actions/workflows/tests.yml/badge.svg?branch=development)](https://github.com/LaravelRUS/SleepingOwlAdmin/actions/workflows/tests.yml)
[![Latest Stable Version](https://poser.pugx.org/laravelrus/sleepingowl/v/stable)](https://packagist.org/packages/laravelrus/sleepingowl)
[![Total Downloads](https://poser.pugx.org/laravelrus/sleepingowl/downloads)](https://packagist.org/packages/laravelrus/sleepingowl)
[![License](https://poser.pugx.org/laravelrus/sleepingowl/license)](LICENSE)

SleepingOwl Admin is a free administrative interface builder for Laravel. It
provides a PHP-first DSL for model sections, CRUD forms, synchronous and
server-side tables, filters, inline editing, navigation, uploads and widgets.

The documentation in this repository describes the current development branch.

## Requirements

- PHP 8.1 or newer;
- Laravel 10, 11, 12 or 13;
- Composer 2.

Lumen is not supported.

Application developers do not need Node.js. SleepingOwl publishes ready
production and development asset profiles through Composer/PHP/Artisan. Node.js
is required only for package maintainers and authors building distributable
theme packages.

## Installation

Install the latest stable release selected by Composer:

```bash
composer require laravelrus/sleepingowl
php artisan sleepingowl:install
```

Stable releases can lag behind the development branch described by these files;
use the documentation shipped with the installed release for its exact API.

To test the current development branch explicitly:

```bash
composer require laravelrus/sleepingowl:dev-development
php artisan sleepingowl:install
```

The install command publishes `config/sleeping_owl.php` and ready assets under
`public/packages/sleepingowl`, creates the configured `app/Admin` bootstrap
directory and files, and creates `app/Providers/AdminSectionsServiceProvider.php`
when it is missing.

After updating the Composer package, republish and verify the package-owned
assets:

```bash
composer update laravelrus/sleepingowl
php artisan sleepingowl:update
php artisan sleepingowl:update --check
```

`sleepingowl:update --check` is read-only. It validates the manifests,
production/development profiles and checksums and returns a non-zero exit code
when the published assets are missing or inconsistent.

## Sections and navigation

Application sections normally extend `SleepingOwl\Admin\Section` and are mapped
to Eloquent models in `app/Providers/AdminSectionsServiceProvider.php`. The
installation also creates these application-owned bootstrap files:

```text
app/Admin/
├── bootstrap.php
├── navigation.php
└── routes.php
```

The class-based Section API is preferred for new code. Closure-based
`AdminSection::registerModel()` registration remains supported.

A complete, executable example with a Section, server-side DataTables, filters,
a card form, policy, widget, custom assets and a Vue 3 island is available in the
[backend extension cookbook](docs/modernization/backend-extension-cookbook.md).

## Frontend and themes

The current frontend is prebuilt and jQuery-free:

- AdminLTE 4 and Bootstrap 5 for the default `adminlte` theme;
- a ready Tailwind 4/Shadcn-inspired theme selected as `shadcn`;
- the official Tabler 1.5.1 presentation selected as CSS-only `tabler`;
- Vue 3 runtime-only islands for interactive form controls;
- DataTables 3 and native feature drivers;
- framework-independent core, shared feature bundles and `shared:ui`;
- separate production and development profiles with a versioned asset manifest.

Choose a theme by configured name:

```php
// config/sleeping_owl.php
'template' => [
    'default' => env('SLEEPINGOWL_TEMPLATE', 'adminlte'),
    'themes' => [
        'adminlte' => SleepingOwl\Admin\Themes\AdminLTETheme::class,
        'shadcn' => SleepingOwl\Admin\Themes\TailwindTheme::class,
        'empty' => SleepingOwl\Admin\Themes\EmptyTheme::class,
        'tabler' => SleepingOwl\Admin\Themes\TablerTheme::class,
    ],
],
```

Only the selected theme is resolved and loaded. An invalid theme name, class,
capability or manifest fails explicitly instead of falling back silently to
AdminLTE. The diagnostic `empty` theme keeps shared styles and icons while
adding no theme-owned presentation rules.

Set `ADMIN_DEV_ASSETS=true` only in a local/debug environment to select the
already-built development profile with source maps and Vue diagnostics. This
switch does not compile assets.

Applications can add their own CSS/JavaScript, override individual Blade views
and change supported `--soa-*` custom properties without rebuilding the package.
See:

- [major upgrade guide](docs/modernization/upgrade-guide.md);
- [AdminLTE 4 migration](docs/modernization/adminlte-4-migration.md);
- [built-in Tabler theme](docs/modernization/tabler-theme.md);
- [theme customization and external themes](docs/modernization/theme-customization.md);
- [first-party asset API](docs/modernization/first-party-assets.md).

Keep application-owned files outside `public/packages/sleepingowl`; the update
command replaces that package-owned directory.

## Authentication

The default route middleware is `['web']`. To require the application's normal
Laravel authentication, update the published configuration:

```php
'middleware' => ['web', 'auth'],
```

Authentication scaffolding is application-owned. Configure guards and users
with the Laravel version and authentication package used by the application.
ACL middleware such as `role:admin` or `permission:admin` can be added to the
same array.

## Development

PHP checks:

```bash
composer install
composer test
```

Frontend checks for maintainers:

```bash
npm ci
npm run check
npm run test:e2e
```

Useful build commands:

```bash
npm run watch
npm run production
```

`npm run production` regenerates both distributable profiles and their
manifests through Vite. Do not edit generated files under `public/default`
manually.

The CI workflow runs the PHP suite, the complete frontend gate and a clean
no-build consumer installation that rejects accidental Node.js use.

## Documentation and support

- [Package documentation](DOCUMENTATION.md)
- [Architecture](architecture.md)
- [Upgrade guide](docs/modernization/upgrade-guide.md)
- [Issue tracker](https://github.com/LaravelRUS/SleepingOwlAdmin/issues)
- [Official site](https://sleepingowladmin.ru)
- [Telegram community](https://t.me/prtcls)

## License

SleepingOwl Admin is open-source software licensed under the [MIT License](LICENSE).
