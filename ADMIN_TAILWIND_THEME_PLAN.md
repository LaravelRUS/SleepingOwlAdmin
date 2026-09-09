# План встроенной TailwindTheme на shadcn/ui

## Статус и границы

- Статус: **TailwindTheme завершена: Tailwind 4 distribution, acceptance matrix и release gate закрыты**.
- Выбранная основа: **shadcn/ui** как registry component recipes и визуальный язык TailwindTheme. Это не подключение React-приложения и не новый browser runtime.
- Следующий checkpoint отсутствует; дальнейшие theme/build инициативы ведутся отдельными планами.
- Основа: завершённый публичный contract из [`ADMIN_UI_MODERNIZATION_PLAN.md`](ADMIN_UI_MODERNIZATION_PLAN.md) — headless core, `ThemeInterface`, logical asset manifest, Blade-first views, Vue 3 islands, DataTables 3 и no-build publication.
- Эта тема не блокирует основной major-релиз и не меняет compatibility contract существующей `AdminLTETheme`.
- Каждый самостоятельный пункт выполняется тем же циклом: реализация, релевантные проверки, обновление этого файла, отдельный checkpoint-коммит и чистое дерево.

## Зафиксированная архитектура shadcn/ui

### Граница upstream

- shadcn/ui используется как проверяемый исходник markup, Tailwind class recipes, accessibility patterns и design tokens, а не как готовая React-зависимость.
- `react`, `react-dom`, Next.js и React/Radix packages не добавляются в runtime SleepingOwlAdmin. Интерактивность реализуют уже существующие `Admin.Components`, feature drivers и ограниченные Vue 3 islands.
- Каждый перенесённый recipe получает запись с upstream registry name, snapshot/commit, license и локальным owner view; массовое копирование registry не допускается.
- shadcn CLI может использоваться только maintainer-ом для получения/сравнения исходного snapshot. Composer-пользователь не запускает CLI, Tailwind, npm или frontend build.
- Иконки не берутся из `lucide-react`: обе штатные темы продолжают использовать отдельный `shared:icons` bundle Font Awesome 7, а конечные icon classes остаются в Blade.
- Публичные `data-dismiss`, `data-toggle`, `data-widget` и остальные действующие structural `data-*` hooks сохраняются; новые `data-soa-*` не вводятся.

### Слои и владельцы

1. **Design brief и tokens.** До компонентов фиксируются плотность data-heavy admin UI, typography, palette, radius, shadows, motion и один отличительный motif. Color literals принадлежат только `_colors.scss`, остальные build-time defaults — `_variables.scss`, runtime values — `--soa-*` в `_custom-properties.scss`.
2. **shadcn token bridge.** Tailwind/shadcn semantic utilities ссылаются на `--soa-*`; параллельная независимая палитра `--background`/`--primary` не становится вторым источником истины.
3. **Blade UI primitives.** Кнопки, labels, inputs, cards, alerts, badges, tables и overlays оформляются маленькими theme-owned partials на основе выбранных shadcn recipes. В PHP не добавляется resolver классов.
4. **SleepingOwl view mapping.** Полный набор существующих logical views доступен TailwindTheme через реальные overrides и общий package base; application/vendor overrides сохраняют прежний приоритет.
5. **Feature presentation adapters.** Tabs, dropdown, tooltip, sidebar, tree, DataTables, forms, uploads и lightbox получают только theme-owned Sass/Blade presentation. Transport, state и lifecycle не копируются из core/features.
6. **Precompiled delivery.** Tailwind scan выполняется maintainer build-ом по package Blade/Vue sources. В Composer artifact входят готовые production/development assets, manifest и checksums.

### Планируемая структура файлов

```text
src/Themes/
└── TailwindTheme.php

resources/views/themes/shadcn/
├── components/
│   ├── ui/                 # выбранные shadcn-derived Blade primitives
│   └── patterns/           # admin shell, toolbar, empty/error states
└── default/                # только отличающиеся overrides stable logical paths
    ├── _layout/
    ├── _partials/
    ├── column/
    ├── display/
    ├── form/
    ├── helper/
    └── pages/

resources/js/themes/shadcn/
├── runtime.js              # только theme-specific runtime
├── theme.js                # theme runtime composition
└── features/               # theme-specific feature adapters

resources/css/themes/shadcn/
├── tailwind.input.css      # только Tailwind directives/source configuration
├── _colors.scss
├── _variables.scss
├── _custom-properties.scss
├── _shadcn-theme.scss      # aliases shadcn/Tailwind → --soa-*, без color literals
├── _base.scss
├── _components.scss
├── theme.scss
└── features/*/             # presentation adapters внутри theme ownership

tests/Feature/Themes/
└── TailwindThemeTest.php

tests/frontend/browser/
└── tailwind-*.spec.js

docs/modernization/
├── shadcn-component-inventory.md
└── tailwind-theme.md
```

`tailwind.input.css` является только build-tool input. Все написанные вручную rules и значения остаются в Sass; generated Tailwind output публикуется сборкой и вручную не редактируется.

Существующие минимальные `resources/{css,js}/themes/shadcn` являются contract/presentation stubs, созданными для проверки изоляции headless core. Они не считаются готовой TailwindTheme и будут поэтапно приведены к выбранным shadcn recipes без изменения feature behavior.

### Порядок checkpoint-ов

1. Upstream snapshot, license/provenance и точный component inventory.
2. Design brief, token map и shadcn-to-`--soa-*` bridge.
3. `TailwindTheme` skeleton, selection/config и пустой изолированный logical asset entry.
4. Blade primitives и layout/navigation shell.
5. Displays, DataTables presentation и actions.
6. Forms, Vue island props, uploads, editors и related elements.
7. Остальные feature adapters, asset-health footer и accessibility states.
8. Production/development build, no-build artifact, browser/visual acceptance и документация.

Каждый checkpoint заканчивается отдельным локальным commit. Полный suite и production acceptance выполняются один раз после закрытия feature matrix; промежуточно запускаются только затронутые contracts.

## 0. Выбрать основу темы

- [x] Зафиксировать shadcn/ui как основу темы по решению владельца проекта; сравнение других admin templates больше не требуется.
- [x] Зафиксировать точный shadcn/ui snapshot/CLI version, лицензию, provenance и допустимый способ vendor updates.
- [x] Создать `shadcn-component-inventory.md`: registry name, upstream snapshot, local Blade owner, required states и причина включения каждого recipe.
- [x] Подтвердить, что выбранные recipes не требуют React/Radix runtime и сопоставлены существующим native/Vue feature behavior.
- [x] Составить mapping существующих SleepingOwlAdmin views/components на template primitives без копирования feature behavior.
- [x] Зафиксировать визуальное направление, typography, palette и один отличительный design motif до написания theme CSS.
- [x] Подтвердить, что лицензия допускает поставку готового production CSS внутри Composer artifact.

## 1. Создать прямую TailwindTheme

- [x] Добавить `TailwindTheme`, напрямую реализующую `ThemeInterface`, с id `tailwind`, отдельным view namespace/capabilities и существующим отдельным `shared:icons` bundle.
- [x] Объявить `shared:icons`, `theme:shadcn` и только реально поддерживаемые `feature:<id>:theme:shadcn` logical entries.
- [x] Реализовать initialize/runtime composition через публичный logical asset registrar без imports внутренних файлов AdminLTE.
- [x] Добавить выбор TailwindTheme существующим config key `sleeping_owl.template` и документированный service-provider hook.
- [x] Запретить silent fallback к AdminLTE при ошибке конфигурации TailwindTheme.

## 2. Реализовать Blade-first presentation

- [x] Создать первый theme-owned slice: `components/ui` primitives для button/alert/badge/breadcrumb/separator/tooltip, sidebar pattern и logical layout/header/navigation/messages/helper shell.
- [x] Сохранить в shell прямую структуру `.nav-item > .nav-link + .nav-treeview`, config classes, пользовательские attributes и hooks `data-widget`, `data-lte-toggle`, `data-toggle`, `data-bs-toggle`, `data-dismiss`, `data-bs-dismiss`, tooltip template и sidebar state classes.
- [x] Создать полный theme-owned набор layout, navigation, display, table, filter, form, action, widget, auth и helper views.
- [x] Сохранить логические пути views и приоритет application overrides.
- [x] Заменить полный physical mirror каскадом application → Shadcn override → package default; оставить только реально отличающиеся theme files.
- [x] Перенести `soa-*` hooks в общий base markup, сократить Shadcn до одного shell-composition override и архивировать 27 неиспользуемых component prototypes.
- [x] Передавать Tailwind classes/options Vue islands только из Blade props; не зашивать utilities в Vue/feature JavaScript.
- [x] Сохранить публичные `data-dismiss`, `data-toggle`, `data-widget`, field names, ARIA и остальные documented behavior hooks.
- [x] Проверить пользовательские HTML attributes/classes и hook-compatible изменённую вложенность без frontend rebuild.

## 3. Собрать независимые Tailwind assets

- [x] Зафиксировать поддерживаемую Tailwind 4.x версию и build dependencies.
- [x] Добавить `tailwind.input.css`, preset/source/content configuration и отдельный theme build entry.
- [x] Определить theme-owned `_colors.scss`, `_variables.scss`, handwritten `theme.scss` и публичные `--soa-*` defaults; generated utility layer не редактировать вручную.
- [x] Реализовать dark mode через переопределение custom properties и небольшой theme-owned toggle runtime без Bootstrap/AdminLTE.
- [x] Поддержать валидированный `sidebar_background_color` через canonical `--soa-sidebar-bg`; shell и sidebar adapter не вводят вторую палитру.
- [x] Собрать полный стандартный production CSS и development profile; consumer не устанавливает Tailwind CLI и не выполняет content scan.
- [x] Доказать, что `theme:shadcn` и её adapters не содержат Bootstrap/AdminLTE CSS, JavaScript, fonts или transitive runtime dependencies.

## 4. Закрыть feature presentation

- [x] Закрыть shell subset alerts/messages/notifications, dropdowns, tooltips и sidebar: presentation использует canonical `--soa-*`, а behavior остаётся в общих feature drivers.
- [x] Реализовать alerts, dropdowns, tooltips, tabs, sidebar/tree, messages и notifications.
- [x] Реализовать DataTables 3 и Responsive presentation, filters, pagination, processing/error и inline editing.
- [x] Реализовать date/time/daterange, select/multiselect, uploads, gallery/lightbox, WYSIWYG wrappers и related elements.
- [x] Реализовать tree success/error notification adapter через публичные native events без копии tree driver logic.
- [x] Добавить asset health footer partial: `role="status"`, локализованный текст, Sass/custom-property presentation, без modal/toast.

## 5. Customisation и no-build workflow

- [x] Документировать preset/source/content для проектов, которым нужны произвольные utilities в переопределённых Blade views.
- [x] Документировать дополнительный CSS и простые theme settings/custom properties без пересборки core.
- [x] Явно описать границу: стандартная тема работает без Node.js, а новые произвольные utilities требуют отдельного пользовательского CSS build.
- [x] Поставлять готовые production/development assets и checksums через существующий `sleepingowl:update`.
- [x] Переключение между AdminLTE и Tailwind через config не требует изменения package sources или package rebuild.

## 6. Acceptance matrix

- [x] Один PHP display/form сохраняет behavior в AdminLTE и Tailwind, меняется только theme-owned presentation.
- [x] Выбор Tailwind не регистрирует ни один AdminLTE/Bootstrap asset; выбор AdminLTE не регистрирует Tailwind asset.
- [x] Core работает без CSS обеих тем и не содержит class resolver.
- [x] Все feature drivers проходят общий browser contract в Tailwind в пределах объявленных capabilities.
- [x] Light/dark mode, sidebar state/color, keyboard focus, reduced motion и responsive layout проходят browser/visual smoke tests.
- [x] Asset version match/mismatch, locale fallback и отсутствие лишней footer-разметки покрыты PHP/browser tests.
- [x] Чистое Laravel-приложение без Node.js устанавливает и запускает TailwindTheme только через Composer/PHP/Artisan.
- [x] Production/development manifests согласованы, checksums валидны, bundle sizes измерены отдельно.
- [x] README, theme guide, migration guide, config matrix и CHANGELOG обновлены.

## Журнал выполнения

| Дата | Checkpoint | Результат | Commit |
| --- | --- | --- | --- |
| 2026-09-07 | Разделение планов | TailwindTheme вынесена из release-blocking checklist основного плана; реализация остаётся отложенной до выбора готового шаблона. | текущий commit |
| 2026-09-08 | Выбор shadcn/ui и структура | По решению владельца shadcn/ui выбран как источник проверяемых recipes и визуального языка, без React/Next/Radix runtime. Зафиксированы владельцы слоёв, Blade-first mapping, единый `--soa-*` token source, общий Font Awesome entry, дерево файлов и восемь последовательных checkpoint-ов. Код темы и зависимости ещё не добавлялись; следующий пункт — upstream snapshot/license/component inventory. | текущий commit |
| 2026-09-08 | Upstream и component inventory | Закреплены `shadcn@4.21.0`, tag object `5563a464…`, source commit `7c9eaba1…`, npm checksums, Node requirement, MIT license hash/notice и безопасный maintainer-only update workflow. Inventory выбирает 30 `new-york-v4` recipes, задаёт Blade owner, обязательные states, view mapping и существующего владельца behavior; React/Radix/lucide runtime и `.tsx` не включаются. MIT разрешает готовый CSS в Composer artifact при сохранении notice. Документационный checkpoint: build/tests не запускались; identifiers, source paths и license проверены по exact upstream checkout. Следующая точка — design brief, token map и shadcn-to-`--soa-*` bridge. | текущий commit |
| 2026-09-08 | Design brief и token bridge | Зафиксирован data-heavy «operator's ledger»: системная multilingual typography без font download, cool work surfaces, compact geometry и один функциональный motif — 3px logical ledger rail для active/selected/error context. Light/dark colors, type/spacing/radius/motion и shadows разделены по `_colors.scss`/`_variables.scss`; runtime contract расширен canonical `--soa-*`, 27 shadcn/Tailwind aliases не имеют собственных values. Оба профиля пересобраны: theme CSS production 4 470 bytes, development 5 041 bytes; targeted Stylelint, forbidden framework/runtime scan и asset gate 9 tests / 20 assertions прошли. Следующая точка — прямой `TailwindTheme` skeleton/config/isolated logical entry. | текущий commit |
| 2026-09-08 | Прямой TailwindTheme skeleton | `TailwindTheme` напрямую реализует публичный `ThemeInterface`, имеет id `tailwind`, отдельный `sleeping_owl_shadcn::default` namespace и объявляет только `shared:icons`/compatibility/Vue/modules плюс base `theme:shadcn`; до готовности presentation не заявляет feature adapters и capabilities кроме icons. Существующий `sleeping_owl.template` выбирает тему через `ThemeTemplateAdapter`/`ThemeRuntimeAssets`; общий service-provider hook сохранён, invalid config не падает обратно в AdminLTE. Узкий gate: PHP syntax и 13 tests / 63 assertions; assets не менялись, build не запускался. Следующая точка — Blade primitives и layout/navigation shell. | текущий commit |
| 2026-09-08 | Blade primitives и layout/navigation shell | Созданы shadcn-derived button/alert/badge/breadcrumb/separator/tooltip primitives, sidebar pattern и theme-owned logical shell: base/inner layout, header, breadcrumbs, navigation tree, четыре message type, asset-health и helpers. Сохранены config classes, user attributes, direct sidebar selectors, public legacy/new `data-*` hooks, ARIA, mobile/collapsed state и 3px ledger rail. Dropdown/sidebar/tooltip adapters теперь ссылаются только на canonical `--soa-*`; Tailwind заявляет только готовые dropdown/sidebar/tooltip/notification/icons capabilities. Theme-owned runtime сохраняет light/dark mode в localStorage/cookie без Bootstrap/AdminLTE. Оба profiles пересобраны: production theme CSS/JS 12 952/1 287 bytes, development 15 596/6 751 bytes; production adapters dropdown/sidebar/tooltip 1 881/2 227/701 bytes. Gate: Stylelint, forbidden runtime/framework scan, PHP 21 tests / 87 assertions и frontend 70 tests прошли; manifest checksums/asset health согласованы. Следующая точка — displays, DataTables 3 presentation и actions. | текущий commit |
| 2026-09-08 | Displays, DataTables 3 presentation и actions | Все 68 стабильных `display/*` и `column/*` logical paths зеркалированы в Tailwind namespace; добавлены shadcn-derived table/pagination/empty/checkbox/input/native-select/button-group/alert-dialog primitives и `soa-*` presentation для sync/async tables, Responsive details, filters, pagination, selection rail, bulk/row actions, processing/error и inline editor. Field names, user attributes/classes, CSRF/method fields, DataTables/layout slots, selection/edit/date/lightbox/tooltip hooks и ARIA сохранены. Table adapter больше не имеет собственной literal palette: значения alias canonical `--soa-*`; после render gate Tailwind объявляет `feature:table:theme:shadcn` и `table-presentation`. Оба profiles пересобраны и 96 файлов проверены manifest MD5/SHA-256; production theme/table CSS — 16 870/14 032 bytes, development — 20 591/17 475 bytes. Gate: PHP 42 tests / 396 assertions плюс asset 26 / 168, frontend source 109 и compiled 221 tests, Stylelint и forbidden Bootstrap/AdminLTE/jQuery/React/Radix/lucide/color-literal scan прошли. Следующая точка — forms, Vue island props, uploads, editors и related elements. | текущий commit |
| 2026-09-08 | Forms, Vue islands, uploads, editors и related | Все 46 `form/*` logical paths принадлежат Tailwind namespace; добавлены field/card/input-group/label/textarea/radio-group/switch/attachment/progress/dialog/skeleton/spinner primitives. Отдельный `feature:forms:theme:shadcn` adapter оформляет native controls, 12-column responsive grid, actions, files/gallery, Vue Multiselect, image dialog, WYSIWYG/Trix и related groups только через canonical `--soa-*`. Vue file/image/images/select/related получают `soa-*` только из Blade props; сохранены names, attributes, required/readonly, CSRF/method/redirect, upload hooks и `data-card-widget`. Collapse/maximize обслуживает native theme driver без AdminLTE/jQuery. Оба профиля пересобраны; 98 manifest files прошли MD5/SHA-256, forms CSS production/development — 17 200/21 950 bytes, forbidden scan чист. Gate: PHP 76 tests / 414 assertions, frontend 366 tests и полный Stylelint. Следующая точка — tabs/tree/lightbox adapters и widget/auth views. | текущий commit |
| 2026-09-08 | Content adapters и полный view namespace | TailwindTheme подключает независимые lightbox/tabs/tree adapters; их palette сведена к canonical `--soa-*`, а tree success/error policy слушает только `tree:changed`/`tree:failed` и обновляет Blade-owned live region. Добавлены последние dashboard/env-editor/login/tab-badge/CKEditor logical views; inventory подтверждает полный паритет namespace, config classes/props, field names, ARIA и hooks сохранены. Оба профиля содержат по 50 manifest assets; production/development: theme CSS 18 246/22 368, lightbox 1 082/1 257, tabs 1 164/1 374, tree CSS 3 144/3 736, tree JS 1 389/7 476 bytes. Gate: PHP 20/321, frontend 267, ESLint и Stylelint. Следующая точка — Tailwind 4 build/customization/no-build acceptance. | текущий commit |
| 2026-09-08 | Tailwind 4 build и no-build distribution | Exact maintainer-only `tailwindcss`/`@tailwindcss/postcss` 4.3.3 собирают отдельный utility layer без preflight; scan ограничен Tailwind Blade namespace, preset ссылается на canonical `--soa-*`. `theme:shadcn` публикует handwritten и generated CSS, по 51 проверяемому asset на production/development; utility CSS — 2 156/2 819 bytes, без Bootstrap/AdminLTE/jQuery/React/Radix/lucide, color literals и `oklch`. Документированы application utilities/custom properties и граница Node.js; config switch и `sleepingowl:update` используют готовые assets. Gate: production build, PHP 14/61, frontend 268, ESLint, Prettier и PHP syntax. Следующая точка — acceptance matrix и release gate. | текущий commit |
| 2026-09-08 | Acceptance matrix и release gate | Общая browser matrix подтверждает одинаковое объявленное behavior AdminLTE/framework-free/Tailwind, изоляцию assets обоих профилей и Tailwind light/dark, focus, reduced motion, responsive sidebar и custom color; presentation fixtures используют опубликованные theme tokens. PHP gate: 41 tests / 499 assertions; Playwright: 20/20; ESLint, Prettier и PHP syntax проходят. Clean Laravel 12 Composer smoke без Node.js проверил install/update, production/development manifests по 51 файлу, default AdminLTE и реальное config-переключение на Tailwind. Ранее отдельно измерены utility CSS 2 156/2 819 bytes. TailwindTheme завершена. | текущий commit |
| 2026-09-09 | Blade fallback вместо полного mirror | Историческое требование полного физического mirror superseded: все 136 logical paths по-прежнему доступны, но `resources/views/themes/shadcn/default` содержит только 99 реальных overrides, а 37 одинаковых файлов наследуются из `resources/views/default`. 27 Shadcn components остаются theme-owned. Application namespace не изменён; no-identical-override guard и порядок application → theme → base закреплены тестами. Пересборка удалила только ложную `.static` utility из PHP `static fn`: production/development utility CSS 2 050/2 669 bytes. | `337f3184`, `14cccdce`, текущий commit |
| 2026-09-09 | Shared semantic Blade markup | Presentation-only class differences сведены в один base contract: legacy Bootstrap/AdminLTE classes сохранены как compatibility aliases, а `soa-*` hooks доступны обеим темам. Из 99 Shadcn overrides оставлен только реальный boundary композиции `_layout/inner`; navigation, display table и login также стали общими. 27 component prototypes без runtime callers перенесены в `resources/archive/unused-sources`. Оба profiles пересобраны: utility CSS production/development 122/202 bytes. Финальный gate: PHPUnit 632/2997 (11 skipped), Vitest 115 files / 494 tests, Playwright 141/141, ESLint и Stylelint. | `0a434cae`, `b2b6f205`, `328c46f0`, `b1f7f516`, `5888bd52`, `43c8c41b`, `5b609e60`, `2f45a9e9`, текущий commit |
| 2026-09-09 | Canonical Blade owners | После разрешения breaking paths удалён второй слой микрофайлов: 8 bridges переведены на прямые `shared/features` paths; controls/card parts/messages/scalar columns/inline editors передают presentation data в общие owner views; пустые и pass-through placeholders архивированы. Base уменьшен с 136 до 103 Blade, Shadcn хранит 1 structural override и наследует 102; весь активный runtime tree содержит 114 Blade. Guards запрещают пустые, точные duplicate и cross-owner bridge views. | `08683a81`, `12f12956`, `b1e4d708`, `f30b9b63`, `8c1e749b`, `548d6197`, текущий commit |
