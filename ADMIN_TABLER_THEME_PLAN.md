# План встроенной TablerTheme

## Статус и границы

- Статус: **основа выбрана, структура создания зафиксирована; реализация ещё не начата**.
- Позиция: третья встроенная тема после `AdminLTETheme` и `TailwindTheme`.
- Выбранная основа: официальный [Tabler Admin Template](https://tabler.io/admin-template).
- Стабильный theme id: `tabler`; PHP class: `SleepingOwl\Admin\Themes\TablerTheme`.
- Следующий checkpoint до реализации: зафиксировать точный upstream release/package, Bootstrap compatibility, license/provenance, published Sass/CSS/JS/static assets и допустимый vendor-update workflow.
- Основа темы — завершённый публичный contract из [`ADMIN_UI_MODERNIZATION_PLAN.md`](ADMIN_UI_MODERNIZATION_PLAN.md): headless core, `ThemeInterface`, logical assets, Blade-first views, Vue 3 islands, DataTables 3 и no-build publication.
- Тема не меняет PHP DSL, server-side processing, feature behavior или config keys и не блокирует уже закрытый AdminLTE release gate.
- Каждый самостоятельный пункт заканчивается обновлением этого файла, релевантными проверками, отдельным локальным commit и чистым рабочим деревом. Push выполняет владелец проекта.

## Архитектурное решение

### Vendor boundary

- Tabler используется только внутри `theme:tabler` и `feature:<id>:theme:tabler`; core/shared/feature drivers не импортируют Tabler или Bootstrap.
- Exact package/release и все его runtime/build dependencies фиксируются lockfile. Floating CDN URLs и загрузка assets со стороннего домена не допускаются.
- Tabler и требуемый им Bootstrap могут быть общими build-time packages с AdminLTE только при совместимых exact versions; готовые browser bundles тем всегда остаются изолированными.
- Готовый aggregate JavaScript Tabler/Bootstrap не подключается автоматически. Сначала составляется inventory: существующие native drivers обслуживают tabs, dropdowns, tooltips, alerts, sidebar и другие capabilities; vendor JS добавляется только для незаменимого, явно проверенного поведения.
- `jquery`, AdminLTE assets и Tailwind output не входят в TablerTheme ни прямо, ни транзитивно.
- Upstream CSS/SCSS и static resources не редактируются. Package-owned адаптация находится только в theme-owned Sass/Blade sources.
- Для каждого используемого Tabler component фиксируются upstream source, version/snapshot, local Blade owner, states и способ обновления.

### Icons и fonts

- По умолчанию TablerTheme использует существующий отдельный `shared:icons` bundle Font Awesome 7, как остальные штатные темы.
- Tabler Icons, icon fonts или SVG sprite не добавляются неявно. Их подключение возможно только отдельным решением с license/size audit и без дублирования `shared:icons`.
- Внешняя загрузка web fonts запрещена. Upstream font stack заменяется theme-owned local/system stack либо публикуемыми локальными font assets после отдельного license/size решения.
- Конечные icon/font classes задаются непосредственно в Blade; PHP class resolver не вводится.

### Styles и tokens

- `_colors.scss` — единственный источник package-owned color literals темы.
- `_variables.scss` — typography, spacing, radius, shadows, density и остальные Sass defaults.
- `_custom-properties.scss` публикует runtime-настраиваемые `--soa-*` values на root темы.
- `_tabler-bridge.scss` связывает публичные `--soa-*` с vendor `--tblr-*` только внутри TablerTheme; vendor variables не становятся публичным SleepingOwlAdmin API.
- `_framework.scss` является единственной точкой импорта Tabler/Bootstrap Sass либо готового vendor CSS. Если upstream предоставляет только compiled CSS, он остаётся отдельным generated/vendor artifact.
- `theme.scss` содержит только package-owned composition и presentation; generated output вручную не редактируется.
- Dark mode меняет custom properties на theme root. JavaScript переключает только существующий color-scheme state и не устанавливает цвета.
- `sidebar_background_color` проходит существующую PHP-валидацию и переопределяет только `--soa-sidebar-bg`; Tabler mapping остаётся внутри theme stylesheet.

### Blade-first rendering

- `resources/views/themes/tabler/default` зеркалирует стабильные logical view paths основной темы: layout, navigation, columns, displays, forms, helpers и auth pages.
- Маленькие внутренние `components/ui` и `components/patterns` уменьшают дублирование Tabler markup, но не меняют публичные logical paths или override priority.
- Bootstrap/Tabler classes задаются в Blade. PHP не знает классов темы, а feature JavaScript привязывается только к documented `data-*`, ARIA и field-name contracts.
- Сохраняются публичные `data-dismiss`, `data-toggle`, `data-widget` и другие действующие hooks; новые `data-soa-*` не вводятся.
- Vue 3 islands получают конечные classes/options через Blade props и используют общий `shared:vue`; отдельных Vue runtime или compiler build у темы нет.
- Visible dynamic controls остаются Blade templates. JavaScript отвечает только за lifecycle, state, transport и безопасное заполнение данных.

## Планируемая структура файлов

```text
src/Themes/
└── TablerTheme.php

resources/views/themes/tabler/
├── components/
│   ├── ui/                 # небольшие Tabler Blade primitives
│   └── patterns/           # shell, toolbar, empty/error/loading states
└── default/                # зеркало стабильных logical view paths
    ├── _layout/
    ├── _partials/
    ├── column/
    ├── display/
    ├── form/
    ├── helper/
    └── pages/

resources/frontend/themes/tabler/
├── index.js                # только доказанный theme-specific runtime
└── styles/
    ├── _colors.scss
    ├── _variables.scss
    ├── _custom-properties.scss
    ├── _tabler-bridge.scss
    ├── _framework.scss
    ├── _base.scss
    ├── _components.scss
    └── theme.scss

resources/frontend/features/*/themes/tabler/styles/
└── *.scss                  # feature presentation adapters

tests/Feature/Themes/
└── TablerThemeTest.php

tests/frontend/browser/
└── tabler-*.spec.js

docs/modernization/
├── tabler-component-inventory.md
└── tabler-theme.md
```

## Порядок checkpoint-ов

1. Upstream release/package, dependency tree, license/provenance и component inventory.
2. Design brief, token map, Tabler-to-`--soa-*` bridge и visual reference screens.
3. `TablerTheme` skeleton, config selection, capabilities и изолированные logical entries.
4. Blade primitives, application shell, header/sidebar/navigation/footer и auth layout.
5. Displays, DataTables 3 presentation, filters, actions и inline editing.
6. Forms, validation, Vue island props, uploads, editors и related elements.
7. Остальные feature adapters, asset-health presentation и accessibility states.
8. Production/development assets, no-build artifact, full browser/visual acceptance и documentation.

Полный PHP/frontend/browser gate и production acceptance выполняются один раз после feature matrix. Промежуточные checkpoints запускают только tests затронутого contract; build выполняется только при изменении публикуемых frontend sources.

## 0. Зафиксировать upstream и дизайн

- [x] Выбрать официальный Tabler Admin Template как основу третьей темы по решению владельца проекта.
- [ ] Зафиксировать exact upstream release/npm package, source URL, checksums, license и допустимый update workflow.
- [ ] Проверить Bootstrap version/peer tree, Node/browser requirements, Sass/CSS exports, JavaScript и static assets.
- [ ] Составить `tabler-component-inventory.md`: upstream component, local Blade owner, states, capability и необходимость vendor JS.
- [ ] Подтвердить отсутствие jQuery и определить, какой Tabler/Bootstrap JavaScript можно не включать благодаря существующим native drivers.
- [ ] Зафиксировать аудиторию и single job: backend-разработчики и операторы управляют data-heavy CRUD, tables, forms и navigation без знания frontend build.
- [ ] Зафиксировать отдельный от AdminLTE design brief: palette, typography, density, layout и один характерный, функционально оправданный motif.
- [ ] Снять reference screens Tabler для layout/navigation, sync/async table, filters/actions, form, uploads, tree, auth, light/dark и compact viewport.

## 1. Создать прямую TablerTheme

- [ ] Добавить `TablerTheme`, напрямую реализующую `ThemeInterface`, с id `tabler`, отдельным view namespace, icons и capabilities.
- [ ] Зарегистрировать `theme:tabler` и только поддерживаемые `feature:<id>:theme:tabler` entries через публичный manifest/registrar.
- [ ] Сохранить `shared:icons`, `shared:vue`, core и feature drivers без копий внутри темы.
- [ ] Добавить выбор `TablerTheme::class` существующим `sleeping_owl.template` и документированный service-provider hook.
- [ ] Неверный class/capability/manifest должен давать диагностическую ошибку без fallback к AdminLTE/Tailwind.
- [ ] Доказать, что выбор Tabler регистрирует ровно один theme bundle и не загружает assets других тем.

## 2. Реализовать Blade primitives и shell

- [ ] Создать theme-owned `components/ui` для реально повторяющихся button, badge, alert, card, form control, table, dropdown, tooltip, tabs, dialog/sheet и loading states.
- [ ] Создать `components/patterns` для page header/actions, filters toolbar, table state, empty/error state и form actions.
- [ ] Реализовать layout, header, sidebar, navigation, breadcrumbs, messages, footer, login и dashboard.
- [ ] Добавить переопределяемый asset-health footer partial с `role="status"`, локализованным текстом и точной update command.
- [ ] Сохранить application/vendor override priority, пользовательские attributes/classes и безопасно изменяемую вложенность.
- [ ] Проверить keyboard navigation, focus visibility, ARIA, reduced motion, responsive shell и light/dark state.

## 3. Реализовать displays и DataTables

- [ ] Перенести columns, sync/async displays, placements, tabs и tree views в Tabler-owned Blade presentation.
- [ ] Добавить DataTables 3/Responsive adapter для table, pagination, length/search, filters, processing/error и responsive layout.
- [ ] Оформить selection, bulk/custom actions, auto-update и inline editor без копирования transport/state/lifecycle logic.
- [ ] Проверить GET/POST server-side processing, state, payload hooks, ordering, filters, multiple tables и table inside tab.
- [ ] Проверить classes/markup через application Blade override без consumer rebuild.

## 4. Реализовать forms и Vue island presentation

- [ ] Перенести card/tabbed forms, validation, help text, inputs, checkboxes/radios, select/multiselect и date/time controls.
- [ ] Передать Tabler classes/options всем шести Vue 3 islands через Blade props; Vue components не импортируют Tabler.
- [ ] Реализовать file/image/files/images, paste/link flows, sorting, gallery/lightbox и readonly states.
- [ ] Реализовать WYSIWYG wrappers, related elements/groups и dependent select без theme-specific feature logic.
- [ ] Проверить dynamic mount/destroy, validation errors, multiple islands и custom module через общий Vue runtime.

## 5. Закрыть feature adapters

- [ ] Tabs, dropdowns, tooltips, alerts/messages, sidebar/navigation tree и notifications используют общие native drivers.
- [ ] Tree success/error presentation слушает публичные events и не монтирует tree повторно.
- [ ] Date/time, lightbox, WYSIWYG и upload vendor DOM получает только Tabler-owned styles/options.
- [ ] Unsupported capability не подключает adapter и не вызывает fallback другой темы.
- [ ] Удалить из Tabler runtime весь vendor JS, который дублирует существующие feature drivers.

## 6. Assets и no-build workflow

- [ ] Добавить exact dependencies и самостоятельные source/build entries без imports AdminLTE/Tailwind.
- [ ] Собрать production и development profiles с одинаковыми logical ids и разными optimization/diagnostics.
- [ ] Добавить version/checksum/static-resource records в общий asset manifest.
- [ ] Публиковать оба профиля одной `php artisan sleepingowl:update`; `ADMIN_DEV_ASSETS` только выбирает готовый профиль.
- [ ] Документировать additional CSS/JS, Blade overrides и `--soa-*` customization без rebuild core/theme.
- [ ] Чистое Laravel-приложение устанавливает и запускает TablerTheme только через Composer/PHP/Artisan, без Node.js.

## 7. Acceptance matrix

- [ ] Один PHP display/form сохраняет behavior в AdminLTE, Tailwind и Tabler; меняется только theme-owned presentation.
- [ ] Core/shared/features остаются framework-independent и byte-identical; PHP не содержит Tabler classes или class resolver.
- [ ] Tabler bundle не содержит AdminLTE, Tailwind, jQuery, лишний Bootstrap/Tabler aggregate JS или дублированные icons.
- [ ] Полная functional matrix tables/actions/forms/uploads/tree/lightbox/WYSIWYG/Vue islands проходит в обоих profiles.
- [ ] Keyboard/focus/ARIA/contrast/reduced-motion/responsive/light-dark browser и visual smoke tests проходят.
- [ ] Asset version match/mismatch, locale fallback и отсутствие лишней footer-разметки покрыты PHP/browser tests.
- [ ] Production/development manifests согласованы, checksums валидны, bundle sizes и license inventory зафиксированы.
- [ ] README, setup/customisation guide, migration notes, config matrix и CHANGELOG обновлены.
- [ ] Release artifact установлен в чистое Laravel-приложение без Node.js и проверен через `sleepingowl:update --check`.

## Журнал выполнения

| Дата | Checkpoint | Результат | Commit |
| --- | --- | --- | --- |
| 2026-09-08 | Выбор Tabler и структура | По решению владельца официальный Tabler Admin Template выбран третьей встроенной темой. Зафиксированы vendor/Bootstrap boundary, Blade-first ownership, Sass/`--soa-*` mapping, отдельный Font Awesome entry, структура файлов и восемь последовательных checkpoints. Зависимости и runtime не менялись; следующий пункт — exact upstream/dependency/license/component inventory. | текущий commit |
