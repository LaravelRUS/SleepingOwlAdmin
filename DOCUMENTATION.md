# SleepingOwl Admin Documentation

SleepingOwl Admin — это мощный конструктор административных интерфейсов для Laravel, позволяющий быстро создавать CRUD-панели с минимальным количеством кода.

## 1. Структура пакета

- `src/`: Основная логика PHP.
    - `Admin.php`: Центральный реестр моделей и секций.
    - `Display/`: Компоненты для отображения данных (таблицы, вкладки, деревья).
    - `Form/`: Компоненты для редактирования данных (формы, элементы форм).
    - `Factories/`: Фабрики для создания компонентов через фасады.
    - `Http/`: Контроллеры, маршруты и middleware.
    - `Providers/`: Сервис-провайдеры для интеграции с Laravel.
- `resources/`:
    - `views/`: Blade-шаблоны.
    - `lang/`: Файлы локализации (en, ru, de и др.).
    - `assets/`: Исходники JS/SASS.
- `config/`: Дефолтная конфигурация.

## 2. Инициализация и требования

- **PHP:** >= 8.1
- **Laravel:** >= 10
- **Зависимости:** `doctrine/dbal`, `spatie/laravel-html`, `erusev/parsedown`, `diglactic/laravel-breadcrumbs`.

После `php artisan sleepingowl:install` пакет:
1. Публикует конфиг `config/sleeping_owl.php`.
2. Публикует ассеты в `public/packages/sleepingowl`.
3. Создает директорию `app/Admin` (по умолчанию) для регистрации секций.

## 3. Конфигурация (config/sleeping_owl.php)

| Ключ | Описание | Дефолт |
| :--- | :--- | :--- |
| `url_prefix` | Префикс URL для админки | `admin` |
| `title` | Название в заголовке и хедере | `Sleeping Owl` |
| `middleware` | Middleware для маршрутов админки | `['web']` |
| `auth_provider` | Провайдер аутентификации | `users` |
| `template` | Класс темы/шаблона UI | `AdminLTETheme::class` |
| `wysiwyg` | Редактор по умолчанию | `ckeditor` |
| `imagesUploadDirectory` | Директория для загрузки изображений | `images/uploads` |
| `aliases` | Список алиасов для фасадов | См. файл |

Выбор `ThemeInterface`, подключение отдельного CSS/JS, поддерживаемые `--soa-*` properties и service-provider hook внешней готовой темы описаны в [no-build theme customization](docs/modernization/theme-customization.md). Эти операции не требуют npm или пересборки core/theme bundles.

## 4. Ядро (Admin Core)

Центральный класс `SleepingOwl\Admin\Admin` управляет регистрацией моделей.

### Регистрация модели
```php
AdminSection::registerModel(User::class, function (ModelConfiguration $model) {
    $model->setTitle('Пользователи');
    $model->onDisplay(function () {
        return AdminDisplay::table()->setColumns([
            AdminColumn::text('id', '#'),
            AdminColumn::text('name', 'Имя'),
        ]);
    });
});
```

### Секции (Sections)
Рекомендуется использовать классы секций, наследуемые от `SleepingOwl\Admin\Section`.
Регистрация секций происходит в `app/Providers/AdminSectionsServiceProvider.php`.

## 5. Компоненты отображения (Display)

### Типы Display
- `AdminDisplay::table()`: Статическая таблица.
- `AdminDisplay::datatables()`: Таблица с поддержкой DataTables (JS).
- `AdminDisplay::datatablesAsync()`: Асинхронная загрузка данных.
- `AdminDisplay::tree()`: Древовидная структура.
- `AdminDisplay::tabbed()`: Интерфейс с вкладками.

Для асинхронных DataTables настройка
`sleeping_owl.datatables_settings.display_info = false` скрывает строку с
количеством записей и отключает отдельный запрос общего количества записей.
Подсчёт отфильтрованных записей сохраняется, поскольку он нужен для точной
постраничной навигации. Для отдельной таблицы настройку можно переопределить
методом `setDisplayInfo(bool)`.

Переход к конкретному номеру страницы включён по умолчанию. Его можно отключить
через `sleeping_owl.datatables_settings.page_jump = false`.

### Колонки (Columns)
| Тип | Метод | Описание |
| :--- | :--- | :--- |
| **Text** | `AdminColumn::text('name', 'Label')` | Обычный текст |
| **Link** | `AdminColumn::link('name', 'Label')` | Ссылка на редактирование |
| **Image** | `AdminColumn::image('photo', 'Label')` | Превью изображения |
| **DateTime** | `AdminColumn::datetime('created_at', 'Date')` | Форматированная дата |
| **Boolean** | `AdminColumn::boolean('is_active', 'Active')` | Иконка true/false |
| **Custom** | `AdminColumn::custom('Label', function($model) { ... })` | Произвольный HTML |

### Добавление кастомных вьюшек (addCustomView)
Метод `addCustomView($view, $placement, array $data = [])` позволяет выводить кастомные Blade-шаблоны или готовые объекты `View` в `yield`-секции (placable blocks) макета страницы без конфликтов перезаписи.

**Пример использования:**
```php
$display = AdminDisplay::datatables();
$display
    // Через имя шаблона и массив параметров
    ->addCustomView('Product::status-form', 'card.heading.actions', [
        'statuses' => $this->statuses
    ])
    // Через объект View и метод ->with()
    ->addCustomView(
        view('Product::clear-comment')->with('statuses', $this->statuses),
        'card.heading.actions'
    );
```

**Доступные секции разметки (`$placement`):**
* **Блоки вокруг карточки/таблицы:**
  * `before.card` (или `before.panel`) — верх страницы перед карточкой (дефолтное значение).
  * `card.heading` (или `panel.heading`) — заголовок карточки.
  * `card.heading.actions` (или `panel.heading.actions`) — правая часть заголовка (кнопки управления).
  * `card.buttons` (или `panel.buttons`) — область кнопок внутри карточки.
  * `card.footer` (или `panel.footer`) — подвал карточки.
  * `after.card` (или `after.panel`) — низ страницы под карточкой.
* **Блоки внутри самой таблицы:**
  * `table.header` — перед строками `<thead>` таблицы.
  * `table.footer` — в самом низу таблицы перед закрывающим тегом.

### Слоты layout DataTables

Для `AdminDisplay::datatables()` и `AdminDisplay::datatablesAsync()` блок можно поместить
в отдельную строку layout DataTables через placement `datatable.{position}`.

Доступные слоты:

| Placement | Положение |
| :--- | :--- |
| `datatable.top3` | Полноширинная третья строка над таблицей |
| `datatable.top3Start` | Начало третьей строки над таблицей |
| `datatable.top3End` | Конец третьей строки над таблицей |
| `datatable.top4` | Полноширинная четвертая строка над таблицей |
| `datatable.top4Start` | Начало четвертой строки над таблицей |
| `datatable.top4End` | Конец четвертой строки над таблицей |
| `datatable.bottom3` | Полноширинная третья строка под таблицей |
| `datatable.bottom3Start` | Начало третьей строки под таблицей |
| `datatable.bottom3End` | Конец третьей строки под таблицей |
| `datatable.bottom4` | Полноширинная четвертая строка под таблицей |
| `datatable.bottom4Start` | Начало четвертой строки под таблицей |
| `datatable.bottom4End` | Конец четвертой строки под таблицей |

Номер не ограничен значениями `3` и `4`: поддерживается любой положительный номер без
ведущего нуля, например `datatable.top5Start` или `datatable.bottom10End`. `Start` и `End`
являются логическими началом и концом строки (в LTR-интерфейсе — слева и справа). Без
суффикса блок занимает всю ширину. На одном номере рекомендуется использовать либо
полноширинный слот, либо пару `Start`/`End` — DataTables выводит полноширинный и разделенный
варианты отдельными строками.

Чем больше номер, тем дальше строка находится от таблицы: `top4` располагается выше
`top3`, а `bottom4` — ниже `bottom3`. Строки `top3`, `top4`, `bottom3` и `bottom4`
предназначены для пользовательских блоков и не конфликтуют со штатным layout:

| Штатный position | Содержимое |
| :--- | :--- |
| `top` | Полоса автообновления, если она включена |
| `top2Start` | Поиск DataTables |
| `top2End` | `pageLength`, затем кнопки «Фильтр/Очистить» |
| `bottomStart` | Информация о количестве записей |
| `bottom1Start` | Пагинация |
| `bottom1End` | Переход к номеру страницы, если он включен |

#### Блок из Blade-шаблона

Создайте обычный Blade-файл, например
`resources/views/admin/orders/table-summary.blade.php`:

```blade
<div class="orders-summary">
    Найдено заказов: {{ $ordersCount }}
    <button type="button" data-refresh-orders>Обновить</button>
</div>
```

В `onDisplay()` класса admin-секции подключите его через `addCustomView()`, передав имя
слота вторым аргументом (`$placement`):

```php
public function onDisplay($payload = [])
{
    $display = AdminDisplay::datatablesAsync()
        ->setColumns($this->columns());

    $display->addCustomView(
        'admin.orders.table-summary',
        'datatable.top3Start',
        ['ordersCount' => Order::query()->count()]
    );

    return $display;
}
```

Можно передать и уже созданный объект `View`:

```php
$summary = view('admin.orders.table-summary')
    ->with('ordersCount', $ordersCount);

$display->addCustomView($summary, 'datatable.top4');
```

Несколько вызовов `addCustomView()` с одинаковым placement попадут в один слот в порядке
добавления.

#### Штатный блок из класса admin-секции

Любой placable extension, у которого есть `setPlacement()`, переносится тем же способом.
Например, действия можно поставить справа от пользовательского Blade-блока:

```php
public function onDisplay($payload = [])
{
    $display = AdminDisplay::datatables()
        ->setColumns($this->columns());

    $display->addCustomView(
        'admin.orders.table-summary',
        'datatable.top3Start'
    );

    $display->getActions()->setPlacement('datatable.top3End');
    $display->getLinks()->setPlacement('datatable.top4Start');

    return $display;
}
```

Таким образом можно размещать `Actions`, `ActionsForm`, `ColumnFilters`, `ColumnsTotal`,
`Links` и `CustomView`. В layout переносится исходный DOM-узел без клонирования, поэтому
формы, обработчики событий и функции кнопок продолжают работать. Для нескольких таблиц
блок привязывается к `data-id` своей таблицы и не попадет в соседнюю.

`datatable.*` — namespace placement API, а не имя обычной Blade-секции. Конструкция
`@section('datatable.top3Start')` сама по себе не подключит блок: Blade-разметку следует
передавать через `addCustomView()`, а штатный блок секции — через `setPlacement()`.

## 6. Компоненты форм (Form)

### Типы форм
- `AdminForm::panel()`: Простая панель с элементами.
- `AdminForm::card()`: Форма в виде карточки.
- `AdminForm::tabbed()`: Форма с вкладками.

### Элементы форм (Elements)
| Элемент | Метод |
| :--- | :--- |
| **Text** | `AdminFormElement::text('field', 'Label')` |
| **Select** | `AdminFormElement::select('field', 'Label', [options])` |
| **Checkbox** | `AdminFormElement::checkbox('field', 'Label')` |
| **Wysiwyg** | `AdminFormElement::wysiwyg('field', 'Label')` |
| **Image** | `AdminFormElement::image('field', 'Label')` |
| **DependentSelect** | `AdminFormElement::dependentSelect('field', 'Label', ['dep_field'])` |
| **Password** | `AdminFormElement::password('field', 'Label')` |

### Дополнительные возможности элементов:
- **Генерация значений (Text/Password):**
  ```php
  AdminFormElement::text('promocode', 'Promo')
      ->canGenerate(8) // Длина строки
      ->setCharsGenerate('ABC1234567890'); // Набор символов
  ```
- **Callable/Closure:**
  Можно использовать функции для динамических значений:
  ```php
  // Значение по умолчанию
  AdminFormElement::date('date', 'Date')->setDefaultValue(fn() => now()->addDays(2));
  
  // Динамический текст помощи
  AdminFormElement::text('title', 'Title')->setHelpText(fn(Model $model) => $model->title);
  ```
- **Работа с отношениями:**
  Для отображения данных из отношений в элементах форм:
  ```php
  AdminFormElement::images('images', 'Image in Relation')
      ->setExactValue($this->getModelValue()->images->pluck('image_path'));
  ```

## 7. Маршрутизация и Контроллеры

Пакет использует динамическую маршрутизацию. Основной контроллер — `AdminController`.
Маршруты определяются в `src/Http/routes.php` с использованием паттерна `{adminModel}`.

[Важно] Если вы хотите переопределить логику для конкретной модели, можно указать кастомный контроллер в конфигурации модели:
```php
$model->setControllerClass(MyCustomController::class);
```

## 8. События (Events)

Секции поддерживают события жизненного цикла (на базе Laravel Dispatcher):
- `creating`, `created`
- `updating`, `updated`
- `saving`, `saved`
- `deleting`, `deleted`
- `restoring`, `restored`

Пример использования:
```php
$model->updating(function (ModelConfiguration $section, Model $item) {
    // логика перед обновлением
});
```

## 9. Навигация

Навигация настраивается в `config/navigation.php` или через `AdminNavigation`.
При установке "из коробки" навигация пуста. Каждую модель нужно явно добавить:
```php
$model->addToNavigation($priority = 100, $badge = null);
```

## 10. Состояние "из коробки" и расширение

[Важно] После установки пакет предоставляет пустую оболочку. Для работы необходимо:
1. Создать модели Eloquent.
2. Зарегистрировать их как секции в `AdminSectionsServiceProvider`.
3. Описать методы `onDisplay`, `onCreate`, `onEdit` в секциях.

[Расширение] Вы можете создавать свои типы колонок и элементов форм, наследуя базовые классы `TableColumn` или `NamedFormElement` и регистрируя их через `AliasBinder`.

[Frontend] По умолчанию используется готовая `AdminLTETheme` на AdminLTE 4 и Bootstrap 5. Поведение core и feature drivers не зависит от CSS-фреймворка; конкретная разметка и классы остаются в переопределяемых Blade-шаблонах выбранной темы.

[No-build] Пользователь выбирает готовую тему через существующий ключ `template`, меняет поддерживаемые `--soa-*` свойства и подключает собственные CSS/JS без сборки пакета. Production/development assets публикуются командой `php artisan sleepingowl:update`; Node.js нужен только разработчикам пакета и авторам распространяемых тем.

Подробности: [`docs/modernization/upgrade-guide.md`](docs/modernization/upgrade-guide.md) и [`docs/modernization/theme-customization.md`](docs/modernization/theme-customization.md).

Цельный backend-first пример Section, server-side DataTables, card form, module provider,
policy, widget, custom element/assets и Vue 3 island находится в
[`docs/modernization/backend-extension-cookbook.md`](docs/modernization/backend-extension-cookbook.md).
