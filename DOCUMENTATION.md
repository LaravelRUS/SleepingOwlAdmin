# SleepingOwl Admin: документация текущей ветки

SleepingOwl Admin — PHP-first конструктор административных интерфейсов для
Laravel. Секции описывают CRUD-поведение Eloquent-моделей, а display/form DSL
создаёт таблицы, фильтры, формы, uploads, inline editing и навигацию.

## 1. Требования и установка

Текущая development-ветка поддерживает:

- PHP 8.1 и новее;
- Laravel 10, 11, 12 и 13;
- Composer 2.

Lumen не поддерживается. Node.js приложению-потребителю не нужен: пакет
публикует заранее собранные production/development assets.

```bash
composer require laravelrus/sleepingowl
php artisan sleepingowl:install
```

Stable release может отставать от development-ветки, описанной в этом файле.
Для установленной стабильной версии используйте документацию из её release
artifact.

Для явной установки текущей development-ветки:

```bash
composer require laravelrus/sleepingowl:dev-development
php artisan sleepingowl:install
```

`sleepingowl:install`:

1. публикует `config/sleeping_owl.php`;
2. публикует готовые assets в `public/packages/sleepingowl`;
3. создаёт `app/Admin/bootstrap.php`, `navigation.php` и `routes.php`;
4. создаёт `app/Providers/AdminSectionsServiceProvider.php`, если его нет.

После обновления Composer package:

```bash
php artisan sleepingowl:update
php artisan sleepingowl:update --check
```

`--check` ничего не записывает: он проверяет оба asset profile, manifest и
checksums и возвращает ненулевой exit code при несовпадении.

## 2. Структура пакета

```text
src/
├── Admin.php                 # Реестр моделей и доступ к template/theme
├── Section.php               # Базовый класс секции
├── Model/                    # ModelConfiguration и repositories
├── Display/                  # Displays, columns, filters и extensions
├── Form/                     # Forms, elements и related forms
├── Navigation/               # Навигационные элементы
├── Routing/                  # ModelRouter и binding adminModel
├── Http/                     # Controllers, routes и middleware
├── Factories/                # Alias-based factories публичного DSL
├── Themes/                   # Выбор темы, registry и runtime assets
├── Assets/                   # Manifest, resolver, registrar и verifier
├── Templates/                # Compatibility/rendering adapter
└── Providers/                # Laravel service providers

resources/
├── css/                      # core, shared, themes и theme-overrides
├── js/                       # core, shared, themes и theme-overrides
├── views/default/            # Полный базовый Blade contract
├── views/themes/shadcn/      # Только реальные Shadcn overrides
├── views/features/           # Общие feature-owned views
└── lang/                     # Локализация

public/default/
├── asset-manifest.json
└── profiles/
    ├── production/
    └── development/
```

Generated-файлы под `public/default` вручную не редактируются.

## 3. Конфигурация и темы

Основные настройки находятся в `config/sleeping_owl.php`:

| Ключ                  | Назначение                                         | Значение по умолчанию |
| :-------------------- | :------------------------------------------------- | :-------------------- |
| `template.default`    | Имя выбранной темы                                 | `adminlte`            |
| `template.themes`     | Карта имён на `ThemeInterface` classes             | `adminlte`, `shadcn`, `empty` |
| `ui`                  | Branding, shell, footer и presentation switches    | См. config            |
| `dev_assets`          | Выбор готового development profile                 | `false`               |
| `url_prefix`          | URL-префикс админки                                | `admin`               |
| `domain`              | Ограничение admin routes по host                   | `false`               |
| `middleware`          | Middleware admin routes                            | `['web']`             |
| `bootstrapDirectory`  | Application-owned admin bootstrap files            | `app/Admin`           |
| `images`, `files`     | Upload paths, extensions и filename behavior       | См. config            |
| `timezone`            | Timezone админки; `null` использует `app.timezone` | `null`                |
| `wysiwyg`             | Редакторы, files и options                         | `ckeditor`            |
| `datatables_settings` | State, pagination, editing и auto-update           | См. config            |

Выбор темы выполняется по имени:

```php
'template' => [
    'default' => env('SLEEPINGOWL_TEMPLATE', 'adminlte'),
    'themes' => [
        'adminlte' => SleepingOwl\Admin\Themes\AdminLTETheme::class,
        'shadcn' => SleepingOwl\Admin\Themes\TailwindTheme::class,
        'empty' => SleepingOwl\Admin\Themes\EmptyTheme::class,
    ],
],
```

`adminlte` использует AdminLTE 4/Bootstrap 5. `shadcn` выбирает готовую
TailwindTheme. Диагностическая `empty` сохраняет shared styles и icons, но не
добавляет theme-owned presentation. Разрешается только выбранная тема; неверное имя, class,
capability или manifest вызывает диагностическое исключение без silent fallback.

Обе темы получают общие `core`, feature drivers и `shared:ui`; presentation и
theme tokens остаются в выбранной теме. Application CSS/JS загружается после
package runtime. Обычный пользователь может:

- переключить готовую тему;
- изменить поддерживаемые `--soa-*` custom properties;
- подключить application CSS/JS через `MetaInterface`;
- переопределить отдельные Blade views;
- установить внешнюю self-contained Composer theme с готовыми assets.

Это не требует npm или пересборки пакета. Подробный контракт, пути Blade
overrides и регистрация внешней темы описаны в
[`docs/modernization/theme-customization.md`](docs/modernization/theme-customization.md).

`ADMIN_DEV_ASSETS=true` выбирает уже собранный development profile с source maps
и Vue diagnostics. Не включайте его в production.

## 4. Секции и модели

Для нового кода рекомендуется класс секции:

```php
use App\Models\User;
use App\Admin\Sections\UserSection;
use SleepingOwl\Admin\Providers\AdminSectionsServiceProvider as ServiceProvider;

final class AdminSectionsServiceProvider extends ServiceProvider
{
    protected $sections = [
        User::class => UserSection::class,
    ];
}
```

Секция наследуется от `SleepingOwl\Admin\Section` и обычно определяет
`onDisplay()`, `onCreate()` и `onEdit()`. В `initialize()` можно добавить её в
навигацию:

```php
public function initialize(): void
{
    $this->addToNavigation()
        ->setPriority(100)
        ->setIcon('fa-solid fa-users');
}
```

Closure-based registration остаётся рабочим compatibility API:

```php
AdminSection::registerModel(User::class, function ($model): void {
    $model->setTitle('Пользователи');
    $model->onDisplay(fn () => AdminDisplay::table()->setColumns([
        AdminColumn::text('id', '#'),
        AdminColumn::text('name', 'Имя'),
    ]));
});
```

## 5. Displays и колонки

Основные display factories:

| Factory                                        | Результат                            |
| :--------------------------------------------- | :----------------------------------- |
| `AdminDisplay::table()`                        | Синхронная таблица                   |
| `AdminDisplay::datatables()`                   | Server-side DataTables 3             |
| `AdminDisplay::datatablesAsync()`              | Alias того же async display          |
| `AdminDisplay::datatablesAsyncAlterPaginate()` | Async display с alternate pagination |
| `AdminDisplay::tree()`                         | Дерево                               |
| `AdminDisplay::tab()` / `tabbed()`             | Вкладка/набор вкладок                |

Доступные обычные колонки: `index`, `action`, `checkbox`, `control`, `count`,
`custom`, `datetime`, `filter`, `gravatar`, `image`, `lists`, `number`, `order`,
`text`, `boolean`, `link`, `relatedLink`, `email`, `treeControl`, `url`.

`AdminColumn::timestamp()` и `AdminColumn::textaddon()` не существуют. Методы с
такими именами есть только у `AdminFormElement`.

### Общие параметры колонок

Третий аргумент named column — дополнительное маленькое значение под основным:

```php
AdminColumn::link('title', 'Title', 'created_at');
AdminColumn::text('created_at', 'Created', 'updated_at');
```

Он трактуется как путь к полю или callback. Для постоянной строки передайте
второй аргумент `true` в `setSmall()`:

```php
AdminColumn::link('title', 'Title')->setSmall('Редактировать', true);
```

Полезные общие методы:

```php
AdminColumn::text('status', 'Status')
    ->setWidth('140px')
    ->setHtmlAttribute('class', 'project-status')
    ->setModifier(fn ($value, $model) => strtoupper((string) $value))
    ->setSearchable(true)
    ->setOrderable(true);
```

`setModifier()` получает текущее значение и модель. `setOrderable()` принимает
`bool`, имя поля или callback. Для вычисляемых полей и сложных relations задайте
callbacks явно:

```php
AdminColumn::link('customer.name', 'Customer')
    ->setSearchCallback(function ($column, $query, $search) {
        return $query->whereHas('customer', fn ($q) =>
            $q->where('name', 'like', '%'.$search.'%')
        );
    })
    ->setOrderable(false);
```

Не оставляйте автоматическую сортировку/поиск включёнными для relation,
computed или неоднозначных SQL-полей, если query не умеет их обработать. Чтобы
включить сортировку relation, передайте в `setOrderable()` callback с безопасным
join/subquery для конкретной схемы.

### Специализированные колонки

`AdminColumn::url()` поддерживает:

- `setText($fieldOrText, $asString = false)`;
- `setIcon($classOrFalse)`;
- `setLinkAttributes(array $attributes)`.

`AdminColumn::gravatar()` поддерживает `setSize()` и `setRating()`. Сейчас он
формирует внешний URL `www.gravatar.com`; custom avatar field и локальный
offline fallback отсутствуют.

`AdminColumn::image()` поддерживает `setImageWidth()`, `setAssetPrefix()` и
`setLazyLoad()`. Отдельного height helper и общего form/display size contract
пока нет.

### Visibility

У колонок есть два разных уровня:

```php
// Скрывает всю колонку. Callback получает объект колонки.
AdminColumn::text('internal', 'Internal')
    ->setVisible(fn ($column) => auth()->user()->can('view-internal'));

// Вычисляется для текущей строки; callback получает модель строки.
AdminColumn::text('secret', 'Secret')
    ->setVisibled(fn ($model) => auth()->user()->can('view', $model));
```

`setVisibilityCondition()` остаётся compatibility alias для `setVisible()` и
не помечен deprecated. Для нового кода используйте `setVisible()`.

Form elements, `DisplayTab` и `DisplayTabbed` также поддерживают
`setVisible(bool|Closure)`; их callback получает текущую модель.

## 6. Editable columns

Доступны:

```php
AdminColumnEditable::text('title', 'Title');
AdminColumnEditable::textarea('description', 'Description')->setMaxRows(6);
AdminColumnEditable::number('priority', 'Priority');
AdminColumnEditable::date('published_at', 'Date');
AdminColumnEditable::datetime('published_at', 'Date and time');
AdminColumnEditable::select('status', 'Status', $options);
AdminColumnEditable::checkbox('enabled', 'Enabled');
AdminColumnEditable::boolean('enabled', 'Enabled');
AdminColumnEditable::checklist('roles', 'Roles', $options);
AdminColumnEditable::range('score', 'Score');
```

Обычный режим — `popup`; для поддерживаемых типов его можно изменить через
`setEditableMode('inline')`. `boolean` является специальным случаем: прямой клик
сразу переключает и сохраняет значение без popup. Editable columns также
поддерживают validation rules/messages, `setReadonly()`, `setModifier()` и
search/order/filter callbacks.

## 7. DataTables и column filters

Column filters задаются позиционно относительно колонок:

```php
$display = AdminDisplay::datatables()
    ->setName('orders')
    ->setMethod('POST')
    ->setColumns([
        AdminColumn::text('id', '#'),
        AdminColumn::text('status', 'Status'),
    ]);

$display->setColumnFilters([
    null,
    AdminColumnFilter::select($statuses, 'Status')
        ->setColumnName('status')
        ->setPlaceholder('All statuses'),
]);
```

Factories фильтров: `text`, `date`, `daterange`, `number`, `range`, `select` и
`control`. Общие методы включают `setColumnName()`, `setColumnRawName()`,
`setHelpText()`, `setWidth()` и `setVisibled()`. `setCallback()` у самого filter
помечен deprecated; новый код задаёт `setFilterCallback()` на колонке.

Для async DataTables:

- `datatables_settings.display_info = false` скрывает summary и пропускает
  запрос общего нефильтрованного количества;
- `datatables_settings.page_jump` включает/выключает переход к номеру страницы;
- `datatables_settings.state_datatables`, `state_filters` и `state_tabs`
  управляют сохранением состояния;
- `datatables_settings.datatables_inline_edit_refresh` принимает `row`, `table`
  или `false`.

### Auto-update

Auto-update включается совпадением CSS-класса таблицы с профилем config:

```php
// Section
AdminDisplay::datatables()
    ->setHtmlAttribute('class', 'table autoupdate');
```

```php
// config/sleeping_owl.php
'datatables_settings' => [
    'autoupdate' => [
        'autoupdate' => ['interval' => 300, 'color' => '#dc3545'],
        'orders-live' => ['interval' => 60, 'color' => '#2563eb'],
    ],
],
```

Интервал задаётся в секундах. UI содержит pause/resume toggle; настройки
профиля валидируются. Пустая карта полностью отключает feature.

### Custom placements

`addCustomView($view, $placement, array $data = [])` принимает Blade view или
готовый `View`. Для DataTables доступны numbered logical rows:

| Placement                               | Положение                         |
| :-------------------------------------- | :-------------------------------- |
| `datatable.top3`, `datatable.top4`, …   | Полноширинная строка над таблицей |
| `datatable.top3Start` / `top3End`       | Начало/конец строки над таблицей  |
| `datatable.bottom3`, `bottom4`, …       | Полноширинная строка под таблицей |
| `datatable.bottom3Start` / `bottom3End` | Начало/конец строки под таблицей  |

Поддерживается любой положительный номер без ведущего нуля. Без суффикса блок
занимает всю ширину; `Start`/`End` образуют пару. На том же ряду не смешивайте
полноширинный placement с `Start`/`End`.

```php
$display->addCustomView(
    'admin.orders.table-summary',
    'datatable.top3Start',
    ['ordersCount' => Order::query()->count()]
);
$display->getActions()->setPlacement('datatable.top3End');
```

Обычные placements `before.card`, `card.heading`, `card.heading.actions`,
`card.buttons`, `card.footer`, `after.card`, `table.header` и `table.footer`
также сохраняются. Имена `panel.*` являются compatibility aliases для
соответствующих `card.*` slots.

## 8. Формы и элементы

Основные формы:

- `AdminForm::form()` — базовая форма;
- `AdminForm::elements()` — набор элементов;
- `AdminForm::card()` — форма-карточка;
- `AdminForm::tabbed()` — форма с вкладками;
- `AdminForm::panel()` — compatibility alias `FormCard`; для нового кода
  используйте `card()`.

Form element factories включают:

- text: `text`, `email`, `password`, `textarea`, `number`, `hidden`, `textaddon`;
- date/time: `date`, `datetime`, `time`, `timestamp`;
- choice: `checkbox`, `radio`, `select`, `multiselect`, `selectajax`,
  `multiselectajax`, `dependentselect`, `multidependentselect`;
- files: `image`, `images`, `file`, `files`, `upload`;
- rich content: `wysiwyg`, `ckeditor`, `trix`;
- layout/custom: `columns`, `column`, `custom`, `html`, `view`;
- relations: `hasMany`, `hasManyLocal`, `manyToMany`, `belongsTo`.

SelectAjax и DependentSelect используют общий локализованный Vue Multiselect
island. Старый `setSelect2()` является compatibility option normalizer, а не
подключением Select2 runtime.

Общие form-element возможности:

```php
AdminFormElement::text('title', 'Title')
    ->setDefaultValue(fn () => 'Draft')
    ->setHelpText(fn ($model) => 'ID: '.($model?->getKey() ?? 'new'))
    ->setVisible(fn ($model) => auth()->user()->can('edit', $model))
    ->setReadonly(fn ($model) => $model?->is_locked)
    ->required();
```

Для WYSIWYG доступны `setEditor()`, `setHeight()`, `setParameters()`,
`disableFilter()`, `setFilteredValueToField()`, `withoutCard()` и
`setCollapsed(bool)`. Collapse presentation применяется, когда редактор
рендерится в card wrapper.

## 9. Messages, navigation и routing

Временное сообщение можно добавить через facade:

```php
use SleepingOwl\Admin\Facades\MessageStack;

MessageStack::addSuccess('Сохранено');
MessageStack::addError('Не удалось сохранить');
MessageStack::addWarning('Проверьте данные');
MessageStack::addInfo('Обновление запущено');
```

Соответствующие session keys: `success_message`, `error_message`,
`warning_message`, `info_message`. Ошибки и предупреждения рендерятся с
`role="alert"`; success/info используют status semantics.

Application navigation хранится в `app/Admin/navigation.php` либо строится
через `addToNavigation()`/`AdminNavigation`. Application routes добавляются в
`app/Admin/routes.php`; package CRUD routes находятся в `src/Http/routes.php` и
используют model binding `{adminModel}`.

`AdminController` обслуживает стандартный CRUD lifecycle. Для отдельной секции
можно задать свой controller через `setControllerClass()`. ENV editor удалён из
пакета: routes, config keys и методы controller отсутствуют.

## 10. Расширение и дополнительные руководства

Новые columns/form elements регистрируются через существующие AliasBinder
factories. Команда `sleepingowl:extension:make` умеет создавать scaffolds form
element, widget, policy, module provider, Vue island и custom theme.

Дополнительные материалы:

- [`docs/modernization/backend-extension-cookbook.md`](docs/modernization/backend-extension-cookbook.md)
- [`docs/modernization/upgrade-guide.md`](docs/modernization/upgrade-guide.md)
- [`docs/modernization/theme-customization.md`](docs/modernization/theme-customization.md)
- [`docs/modernization/table-feature-boundaries.md`](docs/modernization/table-feature-boundaries.md)
- [`docs/modernization/first-party-assets.md`](docs/modernization/first-party-assets.md)
- [`architecture.md`](architecture.md)

Legacy classes вроде `hidden-sm`, `.last`, `.badge-list-warning` и `.th-center`
не являются новым cross-theme API. Для нового кода используйте semantic
`soa-*` hooks, public custom properties и application-owned CSS. Не переносите
Bootstrap/AdminLTE/Tailwind classes в PHP core или feature JavaScript.
