# Backend extension cookbook

## Граница примера

Этот нейтральный пример собран из сценариев read-only reference catalog. В нём нет
предметного кода исходного проекта: только публичные SleepingOwl/Laravel contracts и
маленькие методы с одной ответственностью.

Обычный backend-разработчик не собирает frontend пакета. После установки достаточно:

```bash
composer require laravelrus/sleepingowl
php artisan sleepingowl:install --no-interaction
php artisan sleepingowl:update --no-interaction
```

Команда обновления публикует готовые production/development assets. Значение
`ADMIN_DEV_ASSETS=true` выбирает уже опубликованный development profile; npm не нужен.

## Section, server-side DataTables и card form

Копируемый [`OrderSection`](examples/backend-extensions/app/Admin/Sections/OrderSection.php)
показывает один Section без монолитных методов:

- `AdminDisplay::datatables()` возвращает текущую server-side DataTables реализацию;
- `setMethod('POST')` сохраняет POST deployment contract;
- columns, filters, form и options разделены на небольшие методы;
- пользовательские table/row classes передаются напрямую и не преобразуются core;
- `AdminForm::card()` использует обычные text/select/multiselect/date/image elements.

Для небольшой полностью загруженной коллекции можно заменить только фабрику на
`AdminDisplay::table()`. DataTables 3, transport, state и lifecycle подключаются готовыми
assets; PHP section не содержит JavaScript.

Создать исходный Section можно штатной командой и затем сократить его под модель:

```bash
php artisan sleepingowl:section:make OrderSection "App\Models\Order"
```

## PHP-only extensions

Поддерживаемые stubs создаются отдельно и не требуют Node.js:

```bash
php artisan sleepingowl:extension:make form-element Money
php artisan sleepingowl:extension:make widget PendingOrders
php artisan sleepingowl:extension:make policy OrderSectionPolicy
php artisan sleepingowl:extension:make module-provider OrdersAdminServiceProvider
```

Form element сохраняет presentation в сгенерированном Blade-файле. Его alias, widget,
policy, section и дополнительные assets связывает копируемый
[`OrdersAdminServiceProvider`](examples/backend-extensions/app/Providers/OrdersAdminServiceProvider.php).
Provider регистрируется обычным способом Laravel: в `bootstrap/providers.php` для
Laravel 11/12 или в `config/app.php` для Laravel 10.

```php
return [
    App\Providers\AppServiceProvider::class,
    App\Providers\OrdersAdminServiceProvider::class,
];
```

[`navigation.php`](examples/backend-extensions/app/Admin/navigation.php) группирует model
page без зависимости от темы. [`routes/admin.php`](examples/backend-extensions/routes/admin.php)
показывает отдельный module route с теми же prefix/middleware keys старого конфига.

CSS/JS проекта регистрируются через `MetaInterface` с dependency `admin-default`.
Файлы принадлежат приложению, не встраиваются в package bundles и не требуют пересборки
SleepingOwl. Конкретные классы элемента остаются в его Blade view.

## Vue 3 island

Для небольшого island без собственного bundler используется готовый Vue runtime:

```bash
php artisan sleepingowl:extension:make vue-island order-status
```

Stub создаёт typed JSON host через `Illuminate\Support\Js::encode()`, регистрирует
component через `Admin.Vue.register()` и подключает script после `admin-vue-init`.
Глобальные `Vue`, jQuery и общий root app не создаются. Для динамического Vue-host применяются
`Admin.Vue.scan(root)` после вставки и `Admin.Vue.destroy(root)` до удаления. Если subtree также
содержит другие managed controls, используются более широкие `Admin.Components.scan(root)` и
`Admin.Components.destroy(root)`.

Development runtime включается только конфигом:

```dotenv
ADMIN_DEV_ASSETS=true
```

Перед production deployment значение возвращается в `false`; повторная сборка пакета не
нужна. Если island автор использует SFC или TypeScript, он собирает только свой application
entry и подключает результат через `MetaInterface`.

## Custom theme и config compatibility

Каркас внешней темы создаётся отдельно:

```bash
php artisan sleepingowl:extension:make theme ProjectTheme
```

Выбор по-прежнему выполняется существующим `sleeping_owl.template`. Старый опубликованный
config не заменяется целиком: добавляются только подтверждённые новые значения, а
`sleepingowl:update` обновляет только package-owned assets.

Перед переносом крупного проекта используются также:

- [upgrade guide](upgrade-guide.md) для jQuery/Vue 2/DataTables и AdminLTE 3→4;
- [config migration matrix](config-migration-matrix.md) для старого config;
- [custom Vue islands](custom-vue-islands.md) для lifecycle и payload contract;
- [theme customization](theme-customization.md) для Blade overrides и extra assets.
