# Laluna read-only reference inventory

## Назначение и границы

Локальный проект `D:\domains\laluna.kit` используется как read-only источник реальных сценариев SleepingOwlAdmin. Он помогает проверить migration contracts, подготовить документацию и спроектировать полезные generator stubs.

До отдельного разрешения запрещены любые изменения файлов, установка/обновление зависимостей, запуск migrations/seeders, изменение Git state и запуск команд с прикладными побочными эффектами в reference project.

В SleepingOwlAdmin не копируются модели, запросы, названия предметной области, данные, credentials и прикладные правила Laluna. Примеры и stubs должны быть нейтральными, небольшими и воспроизводимыми в test application пакета.

## Снимок сценариев на 2026-09-06

### PHP/admin structure

- в application-level `app/Admin`: 3 model sections с `initialize`, `onDisplay`, create/edit/delete hooks;
- 8 custom `NamedFormElement` classes с отдельными Blade views;
- 2 custom widgets;
- 3 section model policies;
- собственные `app/Admin/bootstrap.php`, `navigation.php` и `routes.php`;
- custom admin CSS/JS подключаются через `Meta::addCss` и `Meta::addJs` с dependency `admin-default`.

Основной compatibility corpus находится в `Modules`:

- 26 прикладных модулей и 825 файлов;
- 72 module admin sections;
- 72 section model policies;
- 26 module Admin service providers;
- 66 module Blade views;
- providers независимо регистрируют policies, routes и navigation, включая добавление страниц в уже существующие navigation groups;
- module-код не содержит собственных JS/Vue/SCSS entries: общий custom frontend находится в application `resources`.

Найденный PHP DSL минимум:

- displays: `AdminDisplay::datatables`, `AdminDisplay::table`, `AdminDisplay::tab`, `AdminDisplay::tabbed`, `AdminDisplay::tree`;
- forms: `AdminForm::card`;
- elements: checkbox, columns, date/datetime, dependent select, has-many, html/view, image/images, multiselect, number, password, select/AJAX select, text/text-addon/textarea и зарегистрированные custom elements;
- columns: boolean, checkbox, count, custom, datetime, image, link, lists, text;
- filters: date, range, select;
- inline editable columns: checkbox, number, select, text, textarea;
- meta: addCss, addJs, loadPackage; setFavicon присутствует как закомментированный пример.

Ориентировочная плотность использования в `Modules`: 93 вызова `AdminDisplay::*`, 668 `AdminFormElement::*`, 449 `AdminColumn::*`, 117 `AdminColumnFilter::*` и 26 `AdminColumnEditable::*`. Эти числа используются как сигнал покрытия, а не как значения для копирования в tests.

Уточнённый просмотр `Modules` показывает критичные compatibility signals:

- 74 из 93 display factory calls — `AdminDisplay::datatables()`; остальные покрывают 10 tabs, 6 tabbed containers и 3 tree displays;
- найдено 444 прямых вызова `setHtmlAttribute('class', ...)`, 39 row class callbacks и 72 вхождения placement API;
- особенно часто используются стабильные placements `card.heading` и `card.heading.actions`; также встречаются `before.card`, `before` и `after`;
- sections напрямую используют `ControlLink`, `ControlButton`, `FormCard`, `FormElements`, form buttons, `DisplayTabbed`, `OrderTreeType` и `Initializable`;
- module Blade views не содержат собственного jQuery/Vue-кода, но 8 views всё ещё используют Bootstrap 4 `data-toggle`; общий custom frontend действительно вынесен в application resources;
- 8 module views являются Vue hosts для общих application components: `check-person`, `stock-component`, `fake-check`, `basket-count`, `inventarisation`, `relocation`, `ttn-check` и `np-service`;
- 6 из этих hosts записаны как self-closing custom elements: все перечисленные, кроме `check-person` и `stock-component`; compatibility fixture и migration guide обязаны учитывать browser HTML parsing таких тегов;
- Blade передаёт props напрямую Vue expressions, включая Eloquent/collection payloads (`:persondata="{{ $person }}"`, `:categories="{{ $categories }}"`, `:fops="{{ $fops }}"`); будущий island stub должен заменить это на безопасный typed payload contract, сохранив простой no-build Blade UX;
- 23 из 26 модулей уже имеют парные `MODULE.md`/`MODULE.AI.md`; отсутствующие пары у `Callback`, `Rozetka` и `Taxation` не копируются в package, а отмечают полезные сценарии для будущей документации.

Два module views являются полезными lifecycle references, но не копируются буквально:

- `Todo::todo-stat` запускает polling timers и подписку `storage`; нейтральный stub должен показать возврат cleanup, который снимает listener и очищает каждый timer;
- Cloudflare analytics идемпотентно помечает Chart.js canvases через `data-*`, но не хранит и не уничтожает chart instances; fixture должен регистрировать один component на widget root и вызывать `chart.destroy()` при удалении subtree.

Module views выводятся раньше footer assets legacy layout. Поэтому no-build Blade example регистрирует component через `@push('footer-scripts')` и после поздней регистрации явно вызывает `Admin.Components.scan(document)`. Для динамически вставленного subtree вызывается `scan(insertedRoot)`, а перед удалением — `destroy(removedRoot)`.

Следствие для theme migration: пользовательские HTML classes/attributes и placement names считаются прямым публичным API. Legacy theme обязана объединять свои defaults с ними без потерь; PHP core не должен заменять пользовательские классы semantic resolver-ом. Generator stubs берут из этих sections структуру и API, но не копируют длинные монолитные методы или прикладные правила.

### Config compatibility

Проект использует старый вручную поддерживаемый `config/sleeping_owl.php`, а не свежую копию package config. Значимы:

- state keys DataTables/tabs/filters и POST как default DataTables method;
- `body_default_class`, title/logo/footer/version/favicon и menu text;
- route domain/middleware/prefix и `bootstrapDirectory`;
- upload, lazy image, date/time/timezone и WYSIWYG settings;
- form card flags, breadcrumbs, scroll helpers и DataTables auto-update settings;
- deprecated `show_editor` вместо нового `enable_editor`;
- legacy aliases `KodiCMS\Assets\Facades\Assets`, `PackageManager` и `Meta`.

Этот config становится обязательным типом fixture для migration matrix: отсутствующие новые keys получают package defaults, legacy keys проходят явную normalization/deprecation policy, а весь файл не требует повторной публикации.

### Custom frontend

Первичный статический inventory нашёл:

- более 30 регистраций глобальных Vue 2 components, включая закомментированные legacy строки;
- 2 создания глобального Vue root app;
- 2 Blade `inline-template`;
- отдельный custom admin entrypoint и множество `.vue` components;
- собственные Sass admin partials;
- более 30 совпадений jQuery API и более 30 упоминаний `jQuery` в admin resources.

Это проверяет необходимость документированного Vue 3 custom-island API, development Vue profile, source maps, migration guide для globals/prototype helpers/Vuex и публичных native lifecycle/events вместо jQuery hooks.

## Документация, которую нужно вывести из сценариев

- создание model section с sync table и async DataTables display;
- card form с типовыми fields, validation и select/multiselect;
- создание небольшого custom form element: PHP class, Blade view, регистрация и assets;
- navigation, widget, section policy и custom admin route;
- модульный Admin service provider, который регистрирует sections/policies/routes/navigation и не зависит от concrete theme;
- подключение готового custom CSS/JS через first-party `Meta`/asset registry;
- создание и регистрация Vue 3 island/custom module, отладка с `ADMIN_DEV_ASSETS=true` и production-проверка с `false`;
- обновление старого опубликованного config без полной перепубликации;
- замена legacy `KodiCMS\Assets` facades, Vue 2 globals и jQuery hooks.

Каждый пример должен запускаться на поддерживаемом Laravel, использовать только публичный API и явно указывать, требуется ли frontend toolchain автору расширения. Обычные PHP section/form/widget examples не требуют Node.js.

## Кандидаты для generator stubs

- section: metadata, display, create/edit form и небольшие методы с одной ответственностью;
- custom form element: PHP class + Blade view + регистрация;
- widget: placement, view и минимальный data provider;
- section policy: стандартные view/create/update/delete decisions;
- module Admin service provider: изолированные методы регистрации policies, routes и navigation;
- Vue 3 island/custom module: отдельные mount/unmount, typed props/JSON payload и регистрация через public extension API;
- custom theme skeleton после стабилизации `ThemeInterface` и asset manifest.

Stubs не должны генерировать монолитный section, глобальный Vue app, jQuery, Bootstrap/AdminLTE hardcoded dependencies в core-facing коде или ручные пути к hashed assets. Сгенерированный код проверяется smoke tests и линтерами пакета.

## Использование при pilot migration

Reference inventory можно расширять read-only проверками и использовать для проектирования regression tests. Полная миграция самого Laluna, создание в нём ветки или изменение его config/assets выполняются только после отдельного явного разрешения пользователя.
