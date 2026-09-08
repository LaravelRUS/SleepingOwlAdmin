![bg](https://image.ibb.co/m7Bx0F/12.png)

## Laravel Admin Panel SleepingOwl

[![Build Status](https://travis-ci.org/LaravelRUS/SleepingOwlAdmin.svg?branch=development)](https://travis-ci.org/LaravelRUS/SleepingOwlAdmin)
[![StyleCI](https://styleci.io/repos/52141393/shield?branch=development)](https://styleci.io/repos/52141393)
[![Laravel Support](https://img.shields.io/badge/Laravel-5.5--8.44-brightgreen.svg)]()
[![PHP Support](https://img.shields.io/badge/PHP-7.1.3+-brightgreen.svg)]()

[![Official Site](https://img.shields.io/badge/official-site-blue.svg)](https://sleepingowladmin.ru)
[![Demo Site](https://img.shields.io/badge/demo-site-blue.svg)](https://demo.sleepingowladmin.ru/)
[![Telegram Chat](https://img.shields.io/badge/telegram-chat-blue.svg)](https://t.me/prtcls)
[![Latest Stable Version](https://poser.pugx.org/laravelrus/sleepingowl/v/stable)](https://packagist.org/packages/laravelrus/sleepingowl)
[![Total Downloads](https://poser.pugx.org/laravelrus/sleepingowl/downloads)](https://packagist.org/packages/laravelrus/sleepingowl)
[![License](https://poser.pugx.org/laravelrus/sleepingowl/license)](https://packagist.org/packages/laravelrus/sleepingowl)

SleepingOwl Admin is an administrative interface builder for Laravel. __Completely free__

## ⚠️ Laravel Version Support

> **Starting from the next major release, SleepingOwl Admin will support Laravel 10 and above only.**
>
> Support for older Laravel versions (<= 9) will be dropped to align with modern PHP (>= 8.1) and Laravel standards.

Please ensure your application is updated before upgrading to the next version.


## Support
- `Laravel > 5.5 - 5.8` (`PHP < 7.1.3`)
- `Laravel 6.*` (`PHP >= 7.2`)
- `Laravel 7.*` (`PHP >= 7.2.5`)
- `Laravel 8.*` (`PHP >= 7.3`)
- `Laravel 9.*` (`PHP >= 8.0`)
- `Laravel 10.*` (`PHP >= 8.1`)
- `Laravel 11.*` (`PHP >= 8.2`)
- `Laravel 12.*` (`PHP >= 8.2`)
- `Laravel 13.*` (`PHP >= 8.3`)

__Tested and worked on Laravel (v10.48) and php 8.3__



__Lumen is NOT supported(((__


## Documentation ver.10

Powered by Laravel 5.5 - 10. (latest tested version 10.48.2)

* [Russian](http://sleepingowladmin.ru/#/ru/) (90% process)
* [English](http://sleepingowladmin.ru/#/en/) (30% process)

* [Docs Github](https://github.com/SleepingOwlAdmin/docs/tree/new)

## Next major frontend

The next major release ships a prebuilt, jQuery-free frontend with AdminLTE 4,
Bootstrap 5, Vue 3 islands and DataTables 3. Application developers continue to
define sections, forms and displays in PHP and do not install Node.js or rebuild
package assets.

```bash
composer update laravelrus/sleepingowl
php artisan sleepingowl:update
php artisan sleepingowl:update --check
```

Keep the existing published `config/sleeping_owl.php`; missing keys use package
defaults. `ADMIN_DEV_ASSETS=false` selects the production profile, while
`ADMIN_DEV_ASSETS=true` selects the already-built development profile with
source maps and Vue diagnostics. Changing the profile does not compile assets.
The read-only `--check` command validates both published profiles and returns a
non-zero deployment health-check exit code if a manifest, file or checksum is invalid.

AdminLTE remains the default ready theme. Applications may select a ready custom
`ThemeInterface`, override individual Blade views, add their own CSS/JavaScript,
or change supported `--soa-*` properties without rebuilding SleepingOwl. Start
with the [major upgrade guide](docs/modernization/upgrade-guide.md), the
[AdminLTE 4 migration](docs/modernization/adminlte-4-migration.md), and the
[theme customization guide](docs/modernization/theme-customization.md).

Node.js is required only for package maintainers and theme authors. Maintainers
install the locked toolchain with `npm ci`, use `npm run watch` while developing,
run `npm run production` to regenerate both distributable profiles and manifests,
and run `npm run check:ci` for the complete frontend gate.


## Install `ver 8.*` <small>(last Released)</small>

  Install SleepingOwl Admin

  `composer require laravelrus/sleepingowl:8.*`


## Install `ver 7.*`

  1. Install SleepingOwl Admin

  `composer require laravelrus/sleepingowl:7.*`

  __or__

  If you upgrade the old version change in `composer.json`

  ```
  "laravelrus/sleepingowl": "^7.*"
  ```

  after run `composer update laravelrus/sleepingowl`

  and run `php artisan sleepingowl:update` for update assets


2. Run this command in the terminal (if you want to know more about what exactly this command does, see [install command documentation](https://sleepingowladmin.ru/#/en/installation)):

  ```
  php artisan sleepingowl:install
  ```

## Authentication

1. By default, admin module uses Laravel authentication.

  If you want to use auth, you can run artisan command `php artisan make:auth` (https://laravel.com/docs/authentication)
  and append middleware `auth` to `config/sleeping_owl.php`

  ```php
  ...
  'middleware' => ['web', 'auth']
  ...
  ```

2. Setting up middleware

  By default `auth` middleware use default guard, selected in `config/auth.php`

  ```php
  'defaults' => [
    'guard' => 'web', <- default
    ...
  ],
  ```

3. If you are using some package for ACL like (Laratrust, Zizaco Entrust, etc...)

  ```php
  'middleware' => ['web', 'role:admin'],
  ```
  or
  ```php
  'middleware' => ['web', 'permission:admin'],
  ```


## Copyright and License

Admin was written by Sleeping Owl for the Laravel framework and is released under the MIT License.
See the LICENSE file for details.
