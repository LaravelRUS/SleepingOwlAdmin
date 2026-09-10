# План встроенной TablerTheme

## Статус и границы

- Статус: **архитектурный rebase плана завершён 2026-09-10; реализация ещё не
  начата**.
- Позиция: третья встроенная продуктовая тема после canonical names `adminlte`
  (`AdminLTETheme`) и `shadcn` (`TailwindTheme`).
- Выбранная основа: официальный [Tabler Admin Template](https://tabler.io/admin-template).
- Canonical theme name: `tabler`; PHP class:
  `SleepingOwl\Admin\Themes\TablerTheme`. Имя хранится в config/registry и
  `ThemeSelection`, но не дублируется методом theme class.
- Следующий checkpoint: только upstream/dependency/license/component inventory
  из раздела 0. PHP/theme skeleton начинается отдельным checkpoint после
  зафиксированного input и стабильного shared baseline.
- Источники истины: [`architecture.md`](architecture.md),
  [`theme-contract.md`](docs/modernization/theme-contract.md),
  [`view-boundaries.md`](docs/modernization/view-boundaries.md),
  [`asset-manifest.md`](docs/modernization/asset-manifest.md) и reusable
  [`ADMIN_ADDITIONAL_THEMES_PLAN.md`](ADMIN_ADDITIONAL_THEMES_PLAN.md).
- Тема не меняет PHP DSL, query/transport/state/lifecycle feature behavior,
  public config keys или package-owned shared runtime и не блокирует закрытые
  release gates существующих тем.
- Каждый checkpoint заканчивается обновлением этого файла, узкими проверками
  затронутого owner и чистым рабочим деревом. Build выполняется при изменении
  публикуемых sources/manifest; полный gate — один раз перед release. Push
  выполняет владелец проекта.

## Архитектурное решение

### Selection и public PHP contract

- `sleeping_owl.template.default = tabler` выбирает ключ `tabler` из
  `sleeping_owl.template.themes`, где он связан с `TablerTheme::class`.
  `ThemeRegistry` для этой встроенной темы не используется: он остаётся путём
  регистрации внешних self-contained Composer themes.
- `TablerTheme` реализует только действующие методы `ThemeInterface`:
  `viewNamespace()`, `assets()`, `icons()` и `capabilities()`. Метода `id()` или
  другого источника canonical name в class нет.
- `assets()` возвращает только unscoped declarations. Ожидаемые shared
  dependencies — `shared:compatibility`, `shared:vue` и deferred
  `shared:modules`; optional `theme:overrides` добавляется только при реальном
  correction layer. `core`, `shared:icons`, `shared:ui`, `shared:features` и
  `theme:tabler` theme class не перечисляет — их добавляет runtime.
- `capabilities()` содержит только проверенное подмножество `tabs`, `tooltip`,
  `dropdown`, `modal`, `notification`, `icons`, `sidebar` и
  `table-presentation`. Capability добавляется после готовой presentation и
  executable acceptance, а не авансом.
- Некорректные canonical name, config map, class, declaration, capability или
  manifest завершаются диагностической ошибкой без fallback к AdminLTE/Shadcn.

### Vendor boundary

- Tabler/Bootstrap используются только внутри theme-owned `theme:tabler` и
  optional scoped adapter bundles. Built-in feature presentation по умолчанию
  компилируется в основной theme bundle; отдельный
  `feature:<feature>` declaration допустим только для доказанно независимого
  adapter chunk, после чего runtime сам создаёт
  `feature:<feature>:theme:tabler`.
- `core`, `shared:ui`, `shared:features`, shared Blade и domain/DSL PHP не
  импортируют и не интерпретируют Tabler/Bootstrap. Имя/class допустимы только в
  явной integration boundary: theme class, config, provider, build matrix и
  tests.
- Exact package/release и все runtime/build dependencies фиксируются lockfile.
  Floating CDN URLs и загрузка assets со стороннего домена не допускаются.
- Tabler и требуемый им Bootstrap могут разделять maintainer dependency с
  AdminLTE только при совместимых exact versions; готовые browser bundles и
  manifest URLs тем всегда остаются изолированными.
- Aggregate Tabler/Bootstrap JavaScript не подключается автоматически.
  Существующие native drivers уже владеют tabs, dropdowns, tooltips, alerts,
  sidebar и другими lifecycle; vendor JS добавляется только для незаменимого,
  явно инвентаризированного поведения.
- jQuery, AdminLTE assets и Tailwind output не входят в `theme:tabler` ни прямо,
  ни транзитивно.
- Upstream CSS/SCSS и static resources не редактируются. Package-owned
  адаптация находится только в theme-owned CSS/Blade/JS sources. Для каждого
  используемого Tabler component фиксируются upstream source, version/snapshot,
  local Blade owner, states и способ обновления.

### Icons и fonts

- `ThemeRuntimeAssets` автоматически подключает package-owned `shared:icons`
  bundle Font Awesome 7; `TablerTheme::assets()` не объявляет его повторно.
- `icons()` остаётся пустым, пока тема использует существующие Font Awesome
  classes в Blade. Tabler Icons, icon fonts или SVG sprite возможны только после
  отдельного license/size/API решения и без дублирования `shared:icons`.
- Внешняя загрузка web fonts запрещена. Upstream font stack заменяется
  theme-owned local/system stack либо публикуемыми локальными font assets после
  отдельного license/size решения.
- Конечные icon/font classes принадлежат Blade; PHP class resolver не вводится.

### Styles и tokens

- `theme.scss` является единственной build entry темы. Внутренние Sass partials
  могут разделять vendor imports, literals, tokens и feature presentation, но их
  имена не являются публичным contract.
- Один theme-owned owner хранит color literals/defaults; public presentation
  использует canonical `--soa-*`. Bridge к vendor `--tblr-*` остаётся строго
  внутри темы, а vendor variables не становятся SleepingOwlAdmin API.
- Tabler/Bootstrap Sass либо compiled CSS импортируется в одном theme-owned
  framework boundary. Generated/vendor output не редактируется и не копируется
  в shared layer.
- Shared geometry и behavior не дублируются. Theme CSS задаёт только Tabler
  defaults, vendor bridge и действительно отличающуюся presentation.
- Dark mode меняет properties под `:root[data-color-scheme='dark']` (или
  эквивалентным theme root), а общий JavaScript переключает только состояние.
- Валидированный `sidebar_background_color` переопределяет
  `--soa-sidebar-bg`; Tabler mapping остаётся внутри theme stylesheet.
- Optional `resources/css/theme-overrides/tabler.scss` создаётся только для
  небольших corrections, загружается последним и не становится вторым theme
  bundle.

### Blade-first rendering

- Namespace `sleeping_owl_tabler` регистрируется с ordered hints:
  `resources/views/themes/tabler`, затем package root `resources/views`.
  `TablerTheme::viewNamespace()` возвращает
  `sleeping_owl_tabler::default`.
- `resources/views/themes/tabler/default` содержит только реальные markup
  differences. Отсутствующий файл наследует canonical
  `resources/views/default`; полная копия view tree запрещена. Ноль overrides на
  раннем checkpoint является корректным состоянием.
- Application override
  `resources/views/vendor/sleeping_owl_tabler/default/<logical path>` всегда
  имеет первый приоритет. Stable logical paths, relative `setView()` и fully
  namespaced custom views не меняются.
- Theme-local partial создаётся только для повторяющейся Tabler-specific
  разметки и не вводит параллельный public component DSL.
- Bootstrap/Tabler classes и допустимая вложенность задаются в Blade. PHP не
  знает классов темы, а feature JavaScript привязывается только к documented
  `data-*`, ARIA и field-name contracts.
- Публичные compatibility markers сохраняются там, где они документированы;
  новые hook families не вводятся без отдельного public contract.
- Vue 3 islands получают конечные classes/options через Blade props и используют
  общий `shared:vue`; отдельного Vue runtime/compiler у темы нет. Visible dynamic
  controls остаются Blade templates, JavaScript отвечает за lifecycle/state/
  transport.
- Layout наследует или явно сохраняет
  `sleeping_owl::shared.theme.runtime_properties`, `$theme`, `$themeName`,
  `$themeConfig` и `$assetHealthStatus` contracts.

## Планируемая структура файлов

```text
src/Themes/
└── TablerTheme.php

resources/views/themes/tabler/
└── default/                # только реальные отличия от canonical base
    └── ...                 # sparse logical paths, определённые inventory

resources/js/themes/tabler/
└── theme.js                # optional; только доказанный theme/vendor runtime

resources/css/themes/tabler/
├── theme.scss              # единственный theme:tabler style entry
├── _framework.scss         # один vendor import boundary, если нужен
├── _tokens.scss            # Tabler defaults и --soa-* mapping
└── features/*/             # только Tabler-specific presentation

resources/css/theme-overrides/
└── tabler.scss             # optional и только при доказанном correction layer

tests/Feature/Themes/
└── TablerThemeTest.php

tests/frontend/browser/
├── tabler-*.html
└── tabler-*.spec.js

docs/modernization/
├── tabler-component-inventory.md
└── tabler-theme.md
```

Это ориентир ownership, а не обязательный scaffold. Пустые partials, отдельные
feature chunks и Blade overrides не создаются заранее.

## Порядок checkpoint-ов

1. Exact upstream/package, dependency/license/static inventory, Blade
   differences, component/capability inventory, design brief и reference screens.
2. `TablerTheme` contract skeleton, name-driven config selection, ordered Blade
   namespace и обязательные logical entries.
3. Exact dependency lock, vendor import boundary, tokens и `--soa-*` bridge.
4. Sparse shell/auth overrides — только где canonical markup недостаточен.
5. Displays, DataTables presentation, filters, actions и inline editing.
6. Forms, Vue island props, uploads, editors и related elements.
7. Остальные capabilities, минимизация vendor JS и cross-theme isolation.
8. Production/development profiles, no-build artifact, full browser/visual
   acceptance и documentation.

Полный PHP/frontend/browser gate и production acceptance выполняются один раз
после feature matrix. Промежуточные checkpoints запускают tests затронутого
contract и architecture guards; build выполняется только при изменении
публикуемых frontend sources или manifest output.

## 0. Зафиксировать upstream и дизайн

- [x] Выбрать официальный Tabler Admin Template как основу третьей темы по решению владельца проекта.
- [x] Подтвердить встроенный путь поставки, canonical name `tabler` и отсутствие
      `ThemeInterface::id()`/`ThemeRegistry` в built-in selection path.
- [x] Перебазировать plan на текущие name-driven assets и sparse Blade
      inheritance; архивный общий migration plan больше не является
      зависимостью.
- [ ] Зафиксировать exact upstream release/npm package, source URL, integrity/
      checksum, license и воспроизводимый vendor-update workflow.
- [ ] Проверить Bootstrap version/peer tree, Node/browser requirements,
      Sass/CSS/JavaScript exports и полный static asset inventory. Любой конфликт
      с exact Bootstrap AdminLTE зафиксировать до изменения lockfile.
- [ ] Создать `docs/modernization/tabler-component-inventory.md`: upstream
      component, snapshot, canonical или Tabler Blade owner, states,
      `ThemeCapability` и необходимость vendor JavaScript.
- [ ] Отдельно составить Blade difference inventory: какие logical views
      наследуются без изменений и какие действительно требуют sparse override.
- [ ] Доказать отсутствие jQuery и определить минимальный Tabler/Bootstrap JS,
      который нельзя заменить существующими package-owned native drivers.
- [ ] Зафиксировать аудиторию и single job: backend-разработчики и операторы
      управляют data-heavy CRUD, tables, forms и navigation без знания frontend
      build.
- [ ] Зафиксировать отдельный от AdminLTE/Shadcn design brief: palette,
      typography, density, layout и один характерный, функционально оправданный
      motif.
- [ ] Снять upstream/reference screens для layout/navigation, sync/async table,
      filters/actions, form, uploads, tree, auth, light/dark и compact viewport.

## 1. Создать прямую TablerTheme

- [ ] Добавить `TablerTheme`, напрямую реализующую четыре текущих метода
      `ThemeInterface`; `viewNamespace()` возвращает
      `sleeping_owl_tabler::default`, `icons()` сначала пуст, capabilities —
      только доказанный минимум.
- [ ] Добавить `'tabler' => TablerTheme::class` в
      `sleeping_owl.template.themes` и проверить выбор через
      `template.default = tabler`/`ThemeSelection::name()` без создания остальных
      theme classes.
- [ ] Зарегистрировать ordered Blade hints `themes/tabler → resources/views` под
      namespace `sleeping_owl_tabler` и application override path
      `vendor/sleeping_owl_tabler`.
- [ ] Объявить в `assets()` только реально нужные unscoped shared dependencies;
      не перечислять `core`, `shared:icons`, `shared:ui`, `shared:features` или
      `theme:tabler`.
- [ ] Добавить обязательный `theme:tabler` logical bundle и CSS output обоих
      profiles. JavaScript entry, отдельные `feature:<feature>` и
      `theme:overrides` не создавать, пока inventory не докажет реальный runtime
      или самостоятельный owner.
- [ ] Закрепить exact style/script order `ThemeRuntimeAssets`, включая deferred
      `shared:modules`, и отсутствие AdminLTE/Shadcn URLs при выборе Tabler.
- [ ] Неверный name/class/declaration/capability/manifest должен давать
      диагностическую ошибку без fallback к другой теме.

## 2. Собрать vendor и token boundary

- [ ] После checkpoint 0 добавить exact dependencies/lock без jQuery и без
      изменения зависимостей других тем сверх доказанного совместимого reuse.
- [ ] Создать самостоятельный `theme:tabler` style entry с одним vendor import
      boundary; не импортировать AdminLTE/Shadcn и не копировать shared CSS.
- [ ] Сопоставить Tabler/vendor variables с canonical `--soa-*`; неизвестные
      `--tblr-*` не объявлять public API. Зафиксировать light/dark, typography,
      density, radii, shadows и focus/motion states.
- [ ] Проверить `sidebar_background_color → --soa-sidebar-bg` и отсутствие
      theme-owned color writes из JavaScript.
- [ ] Оставить Font Awesome в автоматически подключаемом `shared:icons`;
      Tabler icons/fonts/static assets добавлять только после отдельного
      license/size решения из inventory.
- [ ] Доказать, что shared/core output не изменился в чисто theme-owned
      checkpoint; общее исправление вынести в `ADMIN_EMPTY_THEME_SHARED_PLAN.md`
      и повторно проверить все темы.

## 3. Реализовать sparse Blade shell

- [ ] Прогнать canonical view tree через Tabler и начать с нулевого sparse
      override set; добавлять файл только при доказанной markup-разнице, не ради
      замены classes, решаемой theme CSS.
- [ ] При необходимости переопределить только layout/header/sidebar/navigation/
      footer/login/dashboard paths из difference inventory; общие shared/feature
      views не копировать.
- [ ] Проверить, что layout сохраняет runtime properties, asset-health status,
      theme variables, messages, breadcrumbs и application assets в правильном
      порядке.
- [ ] Переиспользовать canonical asset-health view, если markup достаточен;
      иначе создать минимальный override с `role="status"`, локализацией и точной
      `php artisan sleepingowl:update` command.
- [ ] Доказать приоритет application override, fallback на base, relative
      `setView()`, fully namespaced custom views и отсутствие identical copies.
- [ ] Закрыть keyboard navigation, focus visibility, ARIA, reduced motion,
      responsive shell и light/dark state.

## 4. Реализовать displays и DataTables presentation

- [ ] Наследовать canonical columns/displays/placements/tabs/tree views и
      добавить только необходимые Tabler markup overrides; table geometry и
      behavior не копировать из shared layer.
- [ ] Добавить DataTables 3/Responsive presentation внутрь `theme:tabler` для
      table, pagination, length/search, filters, processing/error и responsive
      states. Отдельный adapter chunk создавать только при доказанной независимой
      поставке.
- [ ] Оформить selection, bulk/custom actions, auto-update и inline editors через
      Tabler tokens/classes без копирования transport/state/lifecycle logic.
- [ ] Учесть общий Tom Select inline-editor adapter: Tabler задаёт только token/
      presentation differences и не монтирует второй control.
- [ ] Проверить GET/POST processing, state, payload hooks, ordering, filters,
      multiple tables, table inside tab и application Blade/CSS override.

## 5. Реализовать forms и vendor presentation

- [ ] Наследовать canonical card/tabbed forms, validation, help text, inputs,
      checks/radios, select/multiselect и date/time views; sparse override
      создавать только при реальном отличии markup.
- [ ] Передать конечные Tabler classes/options Vue 3 islands через Blade props;
      Vue components не импортируют Tabler и используют один `shared:vue`.
- [ ] Покрыть file/image/files/images, paste/link, sorting, gallery/lightbox,
      readonly, WYSIWYG, related elements/groups и dependent select без
      theme-specific feature behavior.
- [ ] Vendor DOM получает options из публичного adapter contract и только
      Tabler-owned styles; theme JavaScript не сканирует и не монтирует feature
      повторно.
- [ ] Проверить dynamic mount/destroy, validation errors, multiple islands и
      custom module через общий Vue runtime.

## 6. Закрыть capabilities и изоляцию

- [ ] Tabs, dropdowns, tooltips, alerts/messages, sidebar/navigation tree,
      notifications и modal используют package-owned lifecycle drivers; тема
      предоставляет только разметку/presentation.
- [ ] Tree success/error presentation слушает публичные events и не монтирует
      tree повторно; date/time, lightbox, WYSIWYG и upload vendor DOM не получает
      shared/theme leaks.
- [ ] Для каждой объявленной capability доказать complete presentation и
      browser acceptance. Unsupported capability не подключает adapter и не
      вызывает fallback другой темы.
- [ ] Удалить из Tabler runtime vendor JavaScript, дублирующий package drivers;
      подтвердить отсутствие global Vue/DataTable, jQuery и plugin wrappers.
- [ ] Доказать, что `theme:tabler` не содержит AdminLTE/Tailwind, дублированный
      Font Awesome/shared runtime или незаявленные vendor assets.
- [ ] Сравнить один PHP display/form fixture в AdminLTE, Shadcn, framework-free
      `empty` и Tabler: server behavior и hooks неизменны, различается только
      presentation выбранной темы.

## 7. Profiles, no-build workflow и release acceptance

- [ ] Собрать production/development profiles с одинаковыми logical ids и
      разными optimization/diagnostics; manifest содержит существующие files,
      MD5-compatible URL versions и SHA-256 checksums.
- [ ] `ADMIN_DEV_ASSETS`/`sleeping_owl.dev_assets` выбирает один готовый profile
      целиком без смешивания chunks и без consumer rebuild.
- [ ] Оба profiles публикуются одной `php artisan sleepingowl:update` и проходят
      `sleepingowl:update --check`; missing/corrupt/mismatched assets дают точную
      диагностику и восстановительную command.
- [ ] Полная functional matrix tables/actions/forms/uploads/tree/lightbox/
      WYSIWYG/Vue islands проходит в обоих profiles.
- [ ] Keyboard/focus/ARIA/contrast/reduced-motion/responsive/light-dark browser
      и visual smoke tests проходят на reference screens.
- [ ] Asset match/mismatch, locale fallback и отсутствие лишней asset-health
      разметки при match покрыты PHP/browser tests.
- [ ] Bundle sizes, dependency/license/static inventory и отсутствие cross-theme
      URLs зафиксированы автоматическим отчётом.
- [ ] Документировать выбор `tabler`, additional CSS/JS, application namespace
      overrides и `--soa-*` customization без rebuild; обновить README,
      migration notes, config matrix и CHANGELOG.
- [ ] Чистый release artifact устанавливается в Laravel только через Composer/
      PHP/Artisan, без Node.js, и проходит выбор Tabler в production/development
      плюс `sleepingowl:update --check`.
- [ ] Финальный gate: `vendor/bin/phpunit`, `npm run check`,
      `npm run test:e2e`, profile/manifest verifiers и чистое рабочее дерево.

## Журнал выполнения

| Дата | Checkpoint | Результат | Commit |
| --- | --- | --- | --- |
| 2026-09-08 | Выбор Tabler и структура | По решению владельца официальный Tabler Admin Template выбран третьей встроенной темой. Зафиксированы vendor/Bootstrap boundary, Blade-first ownership, Sass/`--soa-*` mapping, отдельный Font Awesome entry, структура файлов и восемь последовательных checkpoints. Зависимости и runtime не менялись; следующий пункт — exact upstream/dependency/license/component inventory. | текущий commit |
| 2026-09-10 | Архитектурный rebase плана | Удалены устаревшие `ThemeInterface::id()`, class-driven selector, ручное scoped asset declaration и полное зеркало Blade tree. План переведён на canonical config name `tabler`, четыре текущих метода `ThemeInterface`, runtime-owned `core`/shared/theme graph, ordered `sleeping_owl_tabler` namespace со sparse overrides и incremental capabilities. Реализация, dependencies и assets не менялись; следующий checkpoint — exact upstream/dependency/license/component/Blade inventory. | текущий commit |
