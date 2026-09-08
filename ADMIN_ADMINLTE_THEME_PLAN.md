# План основной AdminLTETheme

## Статус и границы

- Статус: **активен; обязательный release gate основного major-релиза**.
- Текущая реализация: dependency tree, Sass framework boundary и package-owned Blade/JS presentation переведены на exact AdminLTE 4.9.1/Bootstrap 5.3.8/Popper 2.11.8 без jQuery и AdminLTE 3 Sass. Production/development profiles пересобраны, функциональный gate пройден, а размеры runtime фиксируются автоматическим отчётом.
- Точка возобновления: завершить release-документацию и отдельно доказать установку готового Composer artifact в чистое Laravel-приложение без Node.js.
- Общий platform/core scope находится в [`ADMIN_UI_MODERNIZATION_PLAN.md`](ADMIN_UI_MODERNIZATION_PLAN.md). Tailwind не входит в этот файл и ведётся в [`ADMIN_TAILWIND_THEME_PLAN.md`](ADMIN_TAILWIND_THEME_PLAN.md).
- Каждый самостоятельный пункт: реализация, узкие tests затронутого contract, lint/format только изменённых sources, обновление этого файла, отдельный checkpoint-коммит и чистое рабочее дерево. Build выполняется только при изменении публикуемых assets; полный PHPUnit/Vitest/Playwright gate — один раз перед финальным release gate, не на каждом промежуточном checkpoint.

## 0. Стабилизировать текущий checkpoint

- [x] Обновить `AdminLTEThemeTest` под фактический logical runtime после последних feature entries, проверяя точный состав/порядок вместо хрупкого отдельного счётчика.
- [x] Прогнать полный PHP/frontend/browser gate и записать новый baseline до framework upgrade.
- [x] Проверить, что последние прикладные commits не вернули jQuery, global Vue/DataTable или legacy aggregate в прямой `AdminLTETheme` runtime.

## 1. Обновить framework boundary

- [x] Зафиксировать целевые стабильные версии AdminLTE 4 и Bootstrap 5.3, их peer dependencies и license inventory.
- [x] Обновить `package.json`/lock, удалить runtime Bootstrap 4/AdminLTE 3 dependencies и не добавлять jQuery.
- [x] Перевести DataTables presentation на Bootstrap 5 packages и удалить оставшиеся BS4 adapter artifacts.
- [x] Выделить vendor framework imports только внутри `resources/frontend/themes/legacy-adminlte` либо переименованного theme source boundary.
- [x] Сохранить стабильный logical id `legacy-adminlte` без двойной загрузки assets; id является compatibility handle, а не версией framework dependency.
- [x] Пересобрать production/development profiles и доказать отсутствие jQuery в JS, maps и license sidecars.

### Зафиксированный framework target (2026-09-08)

Следующий dependency-only checkpoint использует exact pins без `^`/`~`: `admin-lte@4.9.1`, `bootstrap@5.3.8` и `@popperjs/core@2.11.8`. На дату проверки это стабильные npm `latest`; pre-release или `admin-lte` tag `legacy` не выбираются. Точные pins удерживают один и тот же framework input между lock review, переносом theme imports и последующей пересборкой assets.

Runtime dependency graph по опубликованным npm metadata:

- root явно объявляет все три exact package: AdminLTE как framework темы, Bootstrap как обязательный peer AdminLTE и Popper как обязательный peer Bootstrap;
- `admin-lte@4.9.1` не объявляет `dependencies`, `optionalDependencies` или bundled packages; единственный peer — `bootstrap: ^5.3.8`;
- `bootstrap@5.3.8` не объявляет `dependencies`, `optionalDependencies` или bundled packages; единственный peer — `@popperjs/core: ^2.11.8`;
- `@popperjs/core@2.11.8` не объявляет runtime/peer/optional/bundled dependencies, поэтому runtime tree на этой ветке заканчивается;
- package `devDependencies` не устанавливаются потребителю и не входят в runtime tree. В частности, `jquery` присутствует только в upstream devDependencies Bootstrap для собственных tests и не должен появиться в root dependencies либо собранных browser assets.

Package/build boundary:

- `admin-lte@4.9.1` имеет `type: module`, экспортирует ESM `dist/js/adminlte.esm.js`, `require` fallback `dist/js/adminlte.min.js`, готовый `dist/css/adminlte.css` и Sass entry `src/scss/adminlte.scss`; Sass entry сам импортирует Bootstrap SCSS, поэтому framework imports остаются theme-owned;
- единственный опубликованный engine constraint — `admin-lte.engines.node: >=20`; Bootstrap 5.3.8 и Popper 2.11.8 `engines` не объявляют. Локальные Node `24.19.0`, npm `11.17.0`, lockfile v3 и включённое обычное peer resolution этому соответствуют, но release/CI build также обязан использовать Node 20+;
- upstream AdminLTE 4.9.1 Browserslist: `>=0.5%`, последние две major-версии, `not dead`, Chrome/Edge ≥97, Firefox ≥104/ESR, Safari/iOS ≥15.4; IE 11, старый Android и KaiOS ≤2.5 исключены. Это более строгая browser boundary, чем Bootstrap 5.3.8 (Chrome/Firefox ≥60, Safari/iOS ≥12), и поэтому она считается эффективной для темы;
- `.browserslistrc` upstream не входит в опубликованные tarballs и не наследуется consumer build автоматически; перед первой пересборкой effective target должен быть явно подтверждён в root build configuration. Совместимость с IE не является целью major-релиза;
- upstream dev toolchains (`sass`, Rollup, Astro и прочие devDependencies) не становятся транзитивными требованиями проекта. Совместимость текущих Mix/Webpack/Sass loaders с экспортируемыми AdminLTE entrypoints проверяется отдельным build checkpoint, а не подменой всего upstream toolchain.

License inventory runtime framework tree:

| Package | Version | License metadata | Published notice | Bundled packages |
| --- | --- | --- | --- | --- |
| `admin-lte` | `4.9.1` | MIT | `LICENSE` | none |
| `bootstrap` | `5.3.8` | MIT | `LICENSE` | none |
| `@popperjs/core` | `2.11.8` | MIT | `LICENSE.md` | none |

Lock checkpoint заменил root `popper@1` на `@popperjs/core@2.11.8`; exact root/resolved versions подтверждены, а `npm ls jquery --all` пуст. MIT notices в production license sidecars проверяются вместе с будущей пересборкой assets. Этот checkpoint не переносил DataTables/Blade/JS/Sass и не пересобирал assets.

## 2. Перевести Blade presentation на AdminLTE 4

- [x] Обновить layout, header, sidebar, navigation, footer и login markup под AdminLTE 4/Bootstrap 5.
- [x] Обновить display/table/filter/action views и responsive grid без переноса classes в PHP/core.
- [x] Обновить form/card/button/validation/upload/gallery/related/WYSIWYG views; Vue islands получают конечные classes/options из Blade props.
- [x] Сохранить публичные field names, HTML attributes, ARIA и реальные compatibility markers `data-dismiss`, `data-toggle`, `data-widget` через native adapters либо документированную migration boundary.
- [x] Сохранить логические пути `sleeping_owl::default.*`, application/vendor override priority и custom views без consumer rebuild.
- [x] Добавить migration table для реально изменённых Bootstrap/AdminLTE classes/selectors/markup, не требуя полной перепубликации views.

## 3. Завершить theme tokens и assets

- [x] `shared:icons` подключён отдельным entry; Font Awesome не встроен в standalone theme CSS.
- [x] Theme-owned `_colors.scss`, `_variables.scss`, `_custom-properties.scss` и Sass entrypoint созданы; handwritten component colors централизованы.
- [x] Light/dark mode переопределяет `--soa-*` properties на theme root без копии component stylesheet.
- [x] `sidebar_background_color` валидируется и задаёт `--soa-sidebar-bg` для light/dark mode; `null` оставляет default темы.
- [x] Asset health warning находится в переопределяемом footer partial, имеет `role="status"`, локализацию и theme-owned Sass presentation.
- [x] Документировать подключение дополнительного CSS/JS и изменение поддерживаемых `--soa-*` properties без пересборки core/theme.
- [x] Проверить, что выбирается только `theme:legacy-adminlte` и её adapters, без entries от Tailwind/custom themes.
- [x] Измерить отдельно core, shared, каждый feature, feature adapters и AdminLTE theme bundle; сравнить с baseline.

## 4. Functional acceptance

- [x] Sidebar/push menu/navigation tree, light/dark mode, persisted state и `sidebar_background_color`.
- [x] Tabs, tooltips, dropdowns, alerts, messages, confirmations и asset health footer.
- [x] Sync/async DataTables 3: GET/POST, pagination, length, search, sort, filters, state, payload hooks, responsive, errors, auto-update и draw hooks.
- [x] Row selection, bulk/custom actions, delete/control confirmation, serialization и reload.
- [x] Date/time/daterange, select/multiselect/dependent select и validation states.
- [x] File/image/files/images upload, paste/link, download/remove, sorting и gallery/lightbox.
- [x] Tree reorder/max depth/expand-collapse and success/error notifications without duplicate mount.
- [x] WYSIWYG adapters, related elements and all six Vue 3 islands with one shared runtime instance.
- [x] Keyboard focus, ARIA, reduced motion and responsive smoke tests for reference screens.

## 5. Config compatibility и no-build workflow

- [x] Existing published `sleeping_owl.php` with `TemplateDefault` still boots through the deprecated adapter.
- [x] New config default selects direct `AdminLTETheme` through unchanged `sleeping_owl.template`.
- [x] Document service-provider hook for selecting/overriding the primary theme without package source changes.
- [x] Route/auth/env/upload/date-time/WYSIWYG/search/alias/table settings preserve keys and behavior.
- [x] `sleepingowl:update` publishes both ready profiles and never overwrites config/application files.
- [ ] Clean Laravel application without Node.js installs the release artifact and runs AdminLTE through Composer/PHP/Artisan only.
- [x] Missing/corrupt assets fail with the update command; version mismatch renders the localized footer warning; matching versions add no warning markup.

## 6. Release documentation

- [ ] Update README/theme guide with AdminLTE setup, custom properties, extra assets and application view overrides.
- [x] Update migration guide for AdminLTE 3→4, Bootstrap 4→5 and removed jQuery hooks/plugins.
- [ ] Update config matrix, PHPDoc/facades/interfaces, generated stubs and CHANGELOG.
- [x] Commit final production/development assets, manifest paths/checksums and bundle measurements.
- [ ] Run clean lock-file build, complete PHP/frontend/browser suite and manual reference-screen smoke test.

## Definition of Done

- AdminLTE 4/Bootstrap 5 presentation and dependencies are entirely theme-owned.
- Direct `AdminLTETheme` runtime contains no jQuery, legacy aggregate, global Vue or global DataTable.
- Headless core/shared/features stay independent of Bootstrap/AdminLTE imports and classes.
- Existing config/DSL/view overrides have documented behavior or an explicit major-release migration entry.
- Composer consumer needs no Node.js/build step and receives verified production/development assets.
- Every checkbox in this file is complete and the corresponding main-plan release gate is marked complete.

## Журнал выполнения

| Дата | Checkpoint | Результат | Commit |
| --- | --- | --- | --- |
| 2026-09-07 | Разделение планов | Основная тема получила отдельный release-blocking checklist; ранее закрытые logical runtime, tokens, dark/sidebar и asset-health checkpoints сохранены, фактический AdminLTE 3→4 upgrade отмечен незавершённым. | текущий commit |
| 2026-09-08 | Framework-free contract baseline | Точный runtime `AdminLTETheme` закреплён как 16 scripts и 17 styles в порядке `core` → declared shared/theme entries → feature drivers и adapters (table adapter до self-booting driver) → завершающий `shared:modules`, с сохранёнными legacy handles. Production/development browser contract загружает только `legacy-adminlte` adapters/theme, исключает Tailwind/custom theme requests и подтверждает отсутствие jQuery, global Vue/DataTable, Bootstrap/AdminLTE JS globals и legacy aggregates. Оба asset-профиля содержат 36 logical entries и 48 файлов; полный PHP gate: 563 tests, 2407 assertions, 11 skipped; frontend gate: Prettier/ESLint/Stylelint, 684 Vitest + 137 Playwright. Framework upgrade не начат. | текущий commit |
| 2026-09-08 | No-build customization и provider hook | `theme-customization.md` закрепляет существующий `sleeping_owl.template`, 15 theme-owned settings, точный source-verified AdminLTE/core/feature `--soa-*` surface, `MetaInterface::addCss()`/`addJs()` и Blade overrides. Новый `ThemeRegistry` регистрирует готовый внешний production/development fragment, scoped выбранной темой, и может явно заменить configured primary class; `TemplateDefault` добавляет отсутствующий MD5 version query к готовым legacy files. По сокращённой testing policy build не запускался: публикуемые assets не менялись; theme/manifest gate — 31 test, 253 assertions, финальный legacy template/config gate — 8 tests, 62 assertions. Framework upgrade не начат. | текущий commit |
| 2026-09-08 | AdminLTE 4 framework metadata | По npm `latest` и package metadata выбраны exact pins `admin-lte@4.9.1`, `bootstrap@5.3.8`, `@popperjs/core@2.11.8`. Runtime graph состоит только из peer chain AdminLTE → Bootstrap → Popper, без обычных/optional/bundled dependencies и без jQuery; upstream devDependencies отделены от consumer tree. Все три пакета MIT и публикуют LICENSE notice. Зафиксированы Node ≥20, ESM/CJS/CSS/Sass exports и эффективный ES2022/browser target AdminLTE; локальный Node 24/npm 11/lockfile v3 совместимы. Package/lock, PHP, Blade, JS, Sass, DataTables и assets не менялись; по ускоренной политике tests/build не запускались. Следующая точка — отдельный dependency-only exact lock checkpoint. | текущий commit |
| 2026-09-08 | AdminLTE 4 dependency/lock | `package.json` и lock переведены с `admin-lte@3.2.0`, Bootstrap 4 и `popper@1` на exact `admin-lte@4.9.1`, `bootstrap@5.3.8`, `@popperjs/core@2.11.8`. Установка удалила 582 legacy transitive packages; `npm ls` подтвердил exact root versions и пустое дерево jQuery. Sources и публикуемые assets не менялись, поэтому build и полные suites отложены. Следующая точка — DataTables Bootstrap 5 presentation/BS4 artifacts. | текущий commit |
| 2026-09-08 | AdminLTE 4 structural migration | По официальной v3→v4 migration guide package Blade переведён на `app-*` layout/sidebar/footer, Bootstrap 5 utilities/forms/input groups и `data-bs-theme`; AdminLTE 3 Sass удалён, theme boundary импортирует только AdminLTE 4. Native adapters понимают официальные v4 markers и сохраняют прежние публичные `data-toggle`/`data-dismiss`/`data-widget`; `main-footer` сохранён как пользовательский compatibility class без v3 CSS. DataTables уже использует BS5 packages, BS4 adapters отсутствуют. Пользовательский development watcher собрал assets; вручную просмотрены dashboard, DataTables screen, edit form и footer. По указанию production build и tests не запускались; визуальный polish оставлен отдельным слоем. | текущий commit |
| 2026-09-08 | AdminLTE 4 migration-guide follow-up | Повторный проход по официальной migration table убрал оставшиеся package-owned `panel`, `card-default`, `card-heading`, `well`, `btn-xs`, offset и устаревшие tab/form classes: login, displays, tabbed forms, controls и Vue props используют AdminLTE 4/Bootstrap 5 markup. Старые `form-group`/`control-label`, panel placements и `main-footer` сохранены только как project compatibility hooks; официальные `data-bs-*`/`data-lte-*` стоят рядом с требуемыми legacy markers. Добавлен application migration guide, исправлены устаревшие bundle/view/table docs и render expectations. В `so13.kit` вручную подтверждены `app-*` layout, footer text/version, table card без legacy panels и create form с Bootstrap 5 labels/controls. Production build и suites по указанию не запускались. | текущий commit |
| 2026-09-08 | AdminLTE 4 final asset acceptance | Production/development profiles пересобраны из lock dependency tree; static gates подтверждают отсутствие jQuery package/runtime в JavaScript, maps и license sidecars. Полный PHP gate: 591 test, 2461 assertion, 11 skipped; frontend gate: Prettier/ESLint/Stylelint, 698 Vitest + 140 Playwright. Browser acceptance покрывает functional matrix, ARIA/keyboard/responsive и явный reduced-motion contract; исправлен cascade layer core motion tokens. Автоматический отчёт фиксирует 33 runtime-файла: production 1 890 962 bytes / 502 187 gzip, development 5 044 837 / 1 010 443; production относительно legacy baseline: −26.9% raw и −14.6% gzip. Config matrix: 113 keys (70 unchanged, 29 same key/new implementation, 14 theme-owned); legacy/minimal fixtures: 42/1. Следующая точка — release-документация и clean Composer application без Node.js. | текущий commit |
