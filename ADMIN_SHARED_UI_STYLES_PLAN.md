# План общих стилей постоянных UI-блоков

## Статус и правила

- Статус: **inventory, Laravel resource layout и укрупнение asset boundaries готовы**.
- Следующий checkpoint: создать отдельный override layer и общий semantic UI layer.
- Общие декларации поставляются отдельным logical entry `shared:ui`, автоматически подключаемым для любой `ThemeInterface`; headless `core` не получает presentation.
- Общий CSS может использовать только semantic `soa-*` classes, behavior hooks и canonical `--soa-*` variables. Тема задаёт значения tokens и действительно отличающиеся overrides.
- В общем слое запрещены Bootstrap/AdminLTE/Tailwind imports, vendor selectors и literal palette. Одинаковые structural rules удаляются из theme adapters.
- Список общих элементов открыт для дополнений; новый элемент сначала получает отдельный checklist с обязательными states, затем переносится в shared layer.
- Каталог или source owner не обязан становиться отдельным public bundle. Новый entry допустим только при независимом runtime-подключении, отдельной поставке или существенной зависимости; всегда загружаемые мелкие модули агрегируются.
- Внутри owner небольшие helpers остаются вместе. Отдельный файл оправдан самостоятельным public API, состоянием/lifecycle, повторным использованием или заметно более простой изолированной проверкой — не названием одной функции.
- После каждого пункта: `[x]`, узкая проверка, запись в журнал и отдельный commit без чужих изменений.

## Целевая структура

```text
resources/
├── css/
│   ├── core/                     # только behavior/accessibility contracts
│   ├── shared/
│   │   ├── shared-ui.scss        # shared:ui для всех тем
│   │   └── features/<feature>/   # общая feature geometry
│   ├── themes/<theme-name>/
│   │   ├── theme.scss            # tokens и presentation темы
│   │   └── features/<feature>/   # adapter только этой темы
│   └── theme-overrides/<theme-name>/
├── js/
│   ├── core/                     # headless API/runtime
│   ├── shared/
│   │   └── features/<feature>/   # общие feature drivers
│   ├── themes/<theme-name>/
│   │   └── features/<feature>/   # adapter только этой темы
│   └── theme-overrides/<theme-name>/
└── views/
    └── themes/<theme-name>/      # полный Blade namespace темы
```

Сторонняя Composer-тема повторяет тот же переносимый unit в своём package:

```text
vendor-theme/
├── src/<ThemeClass>.php
├── resources/
│   ├── css/
│   │   └── themes/<theme-name>/
│   ├── js/
│   │   └── themes/<theme-name>/
│   └── views/
│       └── themes/<theme-name>/
├── public/                       # готовые no-build assets
└── asset-manifest.json           # logical manifest fragment
```

Application регистрирует class и manifest fragment под canonical названием темы, не копируя sources внутрь SleepingOwlAdmin.

Тема является логическим unit: одинаковое `<theme-name>` связывает её CSS, JavaScript и Blade namespace в стандартных Laravel resource folders. Переносимой единицей является Composer package целиком.

`resources/{css,js}/theme-overrides/<theme-name>` содержит локальные изменения/исправления, применяется только к выбранной теме и всегда идёт последним. Application Blade overrides используют стандартный Laravel path `resources/views/vendor/<theme-namespace>`.

Публичные output paths, logical ids, `data-theme` и Blade theme namespace используют то же canonical `<theme-name>`, что и config/resource folders. При полном обновлении старые compatibility names не сохраняются: оба asset profiles пересобираются, а устаревшие generated files удаляются.

## Порядок подключения

CSS: `core -> shared:ui -> shared feature -> selected theme -> selected theme feature adapters -> selected theme overrides -> application CSS`.

JavaScript: `core -> shared runtime -> selected theme runtime -> shared feature drivers -> selected theme adapters -> selected theme overrides -> modules/application scripts`.

Текущий built-in runtime агрегирует все всегда загружаемые feature drivers в `shared:features`, а все adapters конкретной темы — в её `theme:<name>` bundle. Отдельные external adapter chunks остаются допустимы только при настоящей независимой поставке.

Manifest dependencies являются единственным источником порядка; Blade не сортирует и не подключает эти файлы вручную.

## Регистрация и выбор темы

Canonical название хранится один раз — ключом `template.themes`. Отдельного `theme id`, database record или глобального browser state нет.

```php
'template' => [
    'default' => env('SLEEPINGOWL_TEMPLATE', 'adminlte'),
    'themes' => [
        'adminlte' => SleepingOwl\Admin\Themes\AdminLTETheme::class,
        'shadcn' => SleepingOwl\Admin\Themes\TailwindTheme::class,
        // 'tabler' => SleepingOwl\Admin\Themes\TablerTheme::class,
    ],
],
```

- Название — стабильная machine-safe строка `lower-kebab`; оно одновременно является config key, именем resource folders, manifest scope, override folder и значением `data-theme`.
- `template.default` содержит только название выбранной темы; оно должно существовать в `template.themes` или быть зарегистрировано внешним provider.
- `ThemeInterface` не хранит название и не содержит `id()`: выбранное имя передаёт resolver/registry вместе с экземпляром темы.
- Старый `'template' => SomeTheme::class` продолжает работать как legacy shape без повторной публикации config.
- Внешний service provider регистрирует пару `name => ThemeClass` и manifest fragment; конфликт имён завершается явной ошибкой.
- Наличие нескольких тем в config не загружает их assets. `core` и `shared` неизменны, затем регистрируются только выбранные theme/features/overrides.
- Manifest builder добавляет выбранное название к theme-scoped logical entries; Theme-класс не повторяет его в `assets()`.

## 0. Общая инфраструктура

- [x] Провести source inventory постоянных блоков и их дубликатов в AdminLTE/Tailwind.
- [x] Зафиксировать Laravel resource layout: CSS, JavaScript и Blade лежат в `resources/css`, `resources/js` и `resources/views`.
- [x] Зафиксировать тему как logical unit: одинаковое `<theme-name>` связывает `css/themes`, `js/themes` и `views/themes`.
- [x] Отделить локальные CSS/JS исправления в `resources/{css,js}/theme-overrides/<theme-name>`; Blade overrides используют Laravel `views/vendor`.
- [x] Отказаться от отдельного theme id: canonical название хранится только ключом `template.themes`, выбор — в `template.default`.
- [x] Создать каталоги `resources/{css,js}/{core,shared,themes,theme-overrides}` по целевой структуре.
- [x] Переместить общий core/runtime и feature sources; привести public output paths и logical ids к canonical theme names.
- [x] Разложить CSS/JS темы и её feature adapters по `resources/{css,js}/themes/<theme-name>`; сохранить Blade в `resources/views/themes/<theme-name>`.
- [ ] Заменить `ThemeInterface::id()` и внутренний `themeId` на имя, передаваемое config/registry; Theme-класс не дублирует название.
- [x] Добавить новый shape `template.default` + `template.themes`, сохранив fallback для прежнего `'template' => ThemeClass::class`.
- [ ] Ввести logical entry `theme:<name>:overrides`, подключаемый только для выбранной темы и после всех её base/feature entries.
- [ ] Генерировать theme-scoped logical entries из выбранного имени, не перечислять имя повторно в `ThemeInterface::assets()`.
- [ ] Расширить custom-theme scaffold и `ThemeRegistry`: внешний package регистрирует self-contained theme root и готовый manifest fragment без копирования в package.
- [ ] Добавить no-build contract: сторонняя Composer-тема устанавливается с готовыми assets без Node.js и package source edits.
- [x] Зафиксировать для каждого файла один owner: `core`, `shared`, `theme` или `theme override`; перекрёстные копии запрещены.
- [x] Проверить одинаковый детерминированный порядок CSS и JavaScript в production/development manifests.
- [x] Объединить всегда загружаемые built-in feature entries в `shared:features`, а мелкие adapters — в единый bundle каждой темы.
- [ ] Создать `resources/css/shared/shared-ui.scss` и logical entry `shared:ui` в обоих asset profiles.
- [ ] Зафиксировать cascade order `core -> shared -> feature -> theme`; theme override должен быть явным и минимальным.
- [ ] Автоматически регистрировать `shared:ui` ровно один раз для AdminLTE, Tailwind и любой custom theme.
- [ ] Добавить одинаковые semantic classes в AdminLTE/Tailwind Blade; legacy classes оставить compatibility aliases.
- [ ] Добавить static gate: в theme SCSS нет копий перенесённых structural selectors.

## 1. Постоянный application shell

- [ ] `app-wrapper` / `.soa-app`: box sizing, минимальная высота и базовая grid/flex geometry.
- [ ] `app-header` / `.soa-header`: позиция, высота, alignment, списки и responsive geometry.
- [ ] Кнопки `app-header`: `.soa-header-action` / `.soa-icon-button`, одинаковые hit area, alignment, disabled и focus states.
- [ ] `app-sidebar` / `.soa-sidebar`: размеры, flex/overflow, transition, collapsed/mobile geometry и overlay; цвета остаются tokens темы.
- [ ] Sidebar navigation structure: scroll wrapper, list reset, item/link alignment, arrow placement и hidden tree state.
- [ ] `app-main`, page heading и content container: min-width, placement, responsive paddings.
- [ ] `app-footer` / `.soa-footer`: placement, inner/copy/version layout, wrapping и responsive paddings.
- [ ] Asset-health block внутри footer: status/command geometry; severity colors остаются tokens темы.

## 2. Общие controls и containers

- [ ] `.soa-button`: reset, inline-flex geometry, min-size, padding, focus, disabled и size variants.
- [ ] `.soa-icon-button`: square hit area и icon alignment, включая header/editor/scroll controls.
- [ ] Button groups/toolbars: horizontal/vertical layout, wrapping и gaps.
- [ ] `.soa-input`, `.soa-select`, `.soa-textarea`, checkbox/radio/switch: sizing, font inheritance, focus и disabled geometry.
- [ ] Input group, addon, label/help/error layout.
- [ ] `checkbox`: control/label/group geometry и checked, unchecked, indeterminate, focus, disabled, readonly, help/error states.
- [ ] `image`: preview, upload/replace/remove/download/insert actions, progress, empty, error и readonly states.
- [ ] `images`: gallery grid, item preview/order/actions, upload queue/progress, empty, error и readonly states.
- [ ] `file`: file icon/name/metadata, browse/upload/replace/remove/download actions, progress, empty, error и readonly states.
- [ ] `files`: file list/grid, item actions, upload queue/progress, empty, error и readonly states.
- [ ] Card shell: header/body/footer layout, collapsed/maximized geometry; palette/shadow остаются tokens темы.
- [ ] Dialog shell: viewport sizing, form/actions layout и backdrop hook; palette/shadow остаются tokens темы.

## 3. Все inline editable поля

- [ ] Editable trigger: `.soa-inline-editable`, textarea content и `data-max-rows` clamp.
- [ ] Inline/popup root: `.soa-inline-editor`, dialog sizing/open state/backdrop и form grid.
- [ ] Общая control geometry для text, textarea, number, date и datetime.
- [ ] Select/Multiselect geometry и место под clear control.
- [ ] Checkbox, boolean и checklist layout/scrolling.
- [ ] Range slider, output и numeric companion layout.
- [ ] Clear/clear-all, submit/cancel buttons, error и `aria-busy` states.
- [ ] Удалить дубли `_inline-editor.scss` из AdminLTE/Tailwind; в adapters оставить только `--soa-inline-editor-*` values и реальные skin overrides.

## 4. Fixed page controls

- [ ] Унифицировать Blade markup `scrolltotop` / `scrolltobottom`: `.soa-scroll-control`, `href`, ARIA и page-end anchor во всех встроенных темах.
- [ ] Вынести position, stack order, hit area, icon alignment и focus в `shared:ui`.
- [ ] Вынести общие `show` / `hide` visibility states; theme adapters оставляют только token-driven surface/border/shadow/color.
- [ ] Проверить top/bottom placement на desktop/mobile и отсутствие перекрытия footer/inline editor.

## 5. Acceptance

- [ ] AdminLTE, Tailwind и framework-free fixture получают `shared:ui` один раз в production/development.
- [ ] Browser matrix подтверждает одинаковую geometry header/sidebar/footer/buttons/editables/scroll controls; различаться могут только theme tokens/явные overrides.
- [ ] Keyboard focus, reduced motion, responsive sidebar и scroll controls проходят узкий Chromium gate.
- [ ] PHP manifest/runtime tests подтверждают порядок assets и custom-theme workflow.
- [ ] Production/development manifests, MD5/SHA-256 и no-build publication согласованы.
- [ ] Stylelint и forbidden framework/literal-color scan проходят для общего layer.
- [ ] Документация custom theme описывает обязательный `shared:ui` contract и допустимые overrides.

## Журнал выполнения

| Дата | Checkpoint | Результат | Commit |
| --- | --- | --- | --- |
| 2026-09-09 | Inventory и source layout | Выделены четыре приоритетных группы: application shell, common controls, все inline editable поля и fixed scroll controls. Зафиксировано разделение `core`, общего `shared`, отдельной папки каждого `themes/<name>` и последнего `themes/<name>/overrides` для изменений/исправлений конкретного шаблона. CSS/JS получают детерминированный manifest order; public paths/logical entries сохраняются. Код/assets не менялись, tests не запускались. | текущий commit |
| 2026-09-09 | Дополнение component inventory | В общий design checklist отдельными пунктами добавлены `checkbox`, `image`, `images`, `file` и `files` со всеми interactive/loading/empty/error/readonly states. Список остаётся открытым для следующих дополнений. Код/assets не менялись, tests не запускались. | текущий commit |
| 2026-09-09 | Self-contained theme structure | Структура скорректирована для сторонних авторов: каждая тема является переносимым unit с собственными views/scripts/styles/features, а локальный `theme-overrides/<name>` вынесен наружу и загружается последним. Добавлены external Composer theme, manifest fragment, scaffold и no-build contracts; public paths/logical entries/view names сохраняются. Код/assets не менялись, tests не запускались. | текущий commit |
| 2026-09-09 | Упрощение resource tree | Промежуточная целевая source tree упрощена перед переходом к Laravel layout: лишний общий wrapper удалён, а core/shared/themes/overrides получили явные ownership boundaries. Во внешнем theme-package также используется прямой `resources/{views,scripts,styles,features}` без дублирующего `resources/theme`. Код/assets не менялись, tests не запускались. | текущий commit |
| 2026-09-09 | Laravel resource layout | Целевая структура приведена к Laravel convention: `resources/css`, `resources/js`, `resources/views`. Тема остаётся логическим unit через общее `<theme-name>` в type folders; Composer package является физически переносимой единицей. CSS/JS overrides отделены в `theme-overrides/<name>`, application Blade overrides используют стандартный `views/vendor/<namespace>`. Код/assets не менялись, tests не запускались. | текущий commit |
| 2026-09-09 | Выбор темы по названию | Отдельный theme id исключён из целевого контракта. `template` становится блоком с `default` и картой `themes`; canonical name хранится только ключом этой карты. Старый class-string остаётся совместимым. Resolver передаёт имя manifest scope, Theme-класс его не дублирует; `core/shared` не зависят от выбора, загружаются только assets выбранной темы и её overrides. Код/assets не менялись, tests не запускались. | текущий commit |
| 2026-09-09 | Config-driven выбор темы | Package config публикует `template.default` и `template.themes`; resolver валидирует имя/карту, создаёт только выбранный класс и сохраняет runtime fallback для прежнего class-string. Default AdminLTE, switch на `shadcn`, внешний provider, invalid map и unselected-theme поведение закреплены точечными test cases. Документация и migration matrix обновлены; каталоги/assets не перемещались, tests по указанию не запускались. | текущий commit |
| 2026-09-09 | Laravel resource migration | Core, shared features, compatibility code и встроенные темы физически разложены по `resources/css`, `resources/js` и `resources/views/themes`; каталоги тем используют canonical config names `adminlte` и `shadcn`. Неиспользуемый tooltip bridge, семь неподключённых Open Sans variants и лишний `.gitkeep` перенесены в `resources/archive/unused-sources` с сохранением прежних относительных путей. Public output paths и logical ids сохранены, development/production profiles пересобраны. `npm test -- --run`: 115 файлов, 723 теста прошли. | `bda141a8` |
| 2026-09-09 | Canonical asset names | После уточнения scope снято ограничение backward compatibility: runtime ids, `data-theme`, Blade namespace и generated paths приведены к `adminlte`/`shadcn`; 94 старых generated-файла `legacy-adminlte`/`tailwind` удалены и оба профиля пересобраны. Manifest содержит только canonical theme entries. Vitest: 115 файлов, 723 теста; PHPUnit Themes: 78 тестов / 633 assertions; Rendering: 79 тестов / 930 assertions. | `598516a1` |
| 2026-09-09 | Финальный resource audit | Старые resource trees и активные ссылки на них отсутствуют. Reachability scan от всех build entries и поддерживаемых public source boundaries не нашёл orphan JS/Vue/SCSS; три оставшихся Open Sans файла используются, девять неиспользуемых файлов находятся в `resources/archive/unused-sources`. Production/development entry order совпадает. Prettier, ESLint, Stylelint и 723 Vitest прошли; полный PHPUnit: 626 тестов, 3013 assertions, 11 предусмотренных skip. | текущий commit |
| 2026-09-09 | Осмысленное укрупнение bundles | Все девять всегда загружаемых feature drivers и neutral CSS объединены в `shared:features`; built-in feature adapters входят в единый bundle своей темы. Manifest сокращён с 37 до 9 logical entries и с 51 до 14 файлов на профиль. Выбранный AdminLTE runtime сокращён с 33 до 10 файлов; production size уменьшился с 1 843 637 до 1 797 249 bytes, development — с 4 942 211 до 4 758 642 bytes за счёт устранения повторной bundler-обвязки. External independently shipped adapters остаются поддержаны. | текущий commit |
