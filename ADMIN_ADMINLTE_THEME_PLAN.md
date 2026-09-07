# План основной AdminLTETheme

## Статус и границы

- Статус: **активен; обязательный release gate основного major-релиза**.
- Текущая реализация: `AdminLTETheme` уже использует versioned logical runtime и Blade-first contract, но dependency tree всё ещё содержит `admin-lte@3.2.x` и `bootstrap@4.6.x`; целевой upgrade на AdminLTE 4/Bootstrap 5 не считается выполненным.
- Точка возобновления: общий checkpoint extra CSS/theme settings/service-provider hook закрыт; в новой чистой задаче начать раздел 1 с фиксации стабильных версий, peer dependencies и license inventory AdminLTE 4/Bootstrap 5.
- Общий platform/core scope находится в [`ADMIN_UI_MODERNIZATION_PLAN.md`](ADMIN_UI_MODERNIZATION_PLAN.md). Tailwind не входит в этот файл и ведётся в [`ADMIN_TAILWIND_THEME_PLAN.md`](ADMIN_TAILWIND_THEME_PLAN.md).
- Каждый самостоятельный пункт: реализация, узкие tests затронутого contract, lint/format только изменённых sources, обновление этого файла, отдельный checkpoint-коммит и чистое рабочее дерево. Build выполняется только при изменении публикуемых assets; полный PHPUnit/Vitest/Playwright gate — один раз перед финальным release gate, не на каждом промежуточном checkpoint.

## 0. Стабилизировать текущий checkpoint

- [x] Обновить `AdminLTEThemeTest` под фактический logical runtime после последних feature entries, проверяя точный состав/порядок вместо хрупкого отдельного счётчика.
- [x] Прогнать полный PHP/frontend/browser gate и записать новый baseline до framework upgrade.
- [x] Проверить, что последние прикладные commits не вернули jQuery, global Vue/DataTable или legacy aggregate в прямой `AdminLTETheme` runtime.

## 1. Обновить framework boundary

- [ ] Зафиксировать целевые стабильные версии AdminLTE 4 и Bootstrap 5.3, их peer dependencies и license inventory.
- [ ] Обновить `package.json`/lock, удалить runtime Bootstrap 4/AdminLTE 3 dependencies и не добавлять jQuery.
- [ ] Перевести DataTables presentation на Bootstrap 5 packages и удалить оставшиеся BS4 adapter artifacts.
- [ ] Выделить vendor framework imports только внутри `resources/frontend/themes/legacy-adminlte` либо переименованного theme source boundary.
- [ ] Решить migration имени logical id `legacy-adminlte`: сохранить стабильный id либо добавить документированный version-neutral alias без двойной загрузки assets.
- [ ] Пересобрать production/development profiles и доказать отсутствие jQuery в JS, maps и license sidecars.

## 2. Перевести Blade presentation на AdminLTE 4

- [ ] Обновить layout, header, sidebar, navigation, footer и login markup под AdminLTE 4/Bootstrap 5.
- [ ] Обновить display/table/filter/action views и responsive grid без переноса classes в PHP/core.
- [ ] Обновить form/card/button/validation/upload/gallery/related/WYSIWYG views; Vue islands получают конечные classes/options из Blade props.
- [ ] Сохранить публичные field names, HTML attributes, ARIA и реальные compatibility markers `data-dismiss`, `data-toggle`, `data-widget` через native adapters либо документированную migration boundary.
- [ ] Сохранить логические пути `sleeping_owl::default.*`, application/vendor override priority и custom views без consumer rebuild.
- [ ] Добавить migration table для реально изменённых Bootstrap/AdminLTE classes/selectors/markup, не требуя полной перепубликации views.

## 3. Завершить theme tokens и assets

- [x] `shared:icons` подключён отдельным entry; Font Awesome не встроен в standalone theme CSS.
- [x] Theme-owned `_colors.scss`, `_variables.scss`, `_custom-properties.scss` и Sass entrypoint созданы; handwritten component colors централизованы.
- [x] Light/dark mode переопределяет `--soa-*` properties на theme root без копии component stylesheet.
- [x] `sidebar_background_color` валидируется и задаёт `--soa-sidebar-bg` для light/dark mode; `null` оставляет default темы.
- [x] Asset health warning находится в переопределяемом footer partial, имеет `role="status"`, локализацию и theme-owned Sass presentation.
- [x] Документировать подключение дополнительного CSS/JS и изменение поддерживаемых `--soa-*` properties без пересборки core/theme.
- [x] Проверить, что выбирается только `theme:legacy-adminlte` и её adapters, без entries от Tailwind/custom themes.
- [ ] Измерить отдельно core, shared, каждый feature, feature adapters и AdminLTE theme bundle; сравнить с baseline.

## 4. Functional acceptance

- [ ] Sidebar/push menu/navigation tree, light/dark mode, persisted state и `sidebar_background_color`.
- [ ] Tabs, tooltips, dropdowns, alerts, messages, confirmations и asset health footer.
- [ ] Sync/async DataTables 3: GET/POST, pagination, length, search, sort, filters, state, payload hooks, responsive, errors, auto-update и draw hooks.
- [ ] Row selection, bulk/custom actions, delete/control confirmation, serialization и reload.
- [ ] Date/time/daterange, select/multiselect/dependent select и validation states.
- [ ] File/image/files/images upload, paste/link, download/remove, sorting и gallery/lightbox.
- [ ] Tree reorder/max depth/expand-collapse and success/error notifications without duplicate mount.
- [ ] WYSIWYG adapters, related elements and all six Vue 3 islands with one shared runtime instance.
- [ ] Keyboard focus, ARIA, reduced motion and responsive smoke tests for reference screens.

## 5. Config compatibility и no-build workflow

- [x] Existing published `sleeping_owl.php` with `TemplateDefault` still boots through the deprecated adapter.
- [x] New config default selects direct `AdminLTETheme` through unchanged `sleeping_owl.template`.
- [x] Document service-provider hook for selecting/overriding the primary theme without package source changes.
- [ ] Route/auth/env/upload/date-time/WYSIWYG/search/alias/table settings preserve keys and behavior.
- [ ] `sleepingowl:update` publishes both ready profiles and never overwrites config/application files.
- [ ] Clean Laravel application without Node.js installs the release artifact and runs AdminLTE through Composer/PHP/Artisan only.
- [ ] Missing/corrupt assets fail with the update command; version mismatch renders the localized footer warning; matching versions add no warning markup.

## 6. Release documentation

- [ ] Update README/theme guide with AdminLTE setup, custom properties, extra assets and application view overrides.
- [ ] Update migration guide for AdminLTE 3→4, Bootstrap 4→5 and removed jQuery hooks/plugins.
- [ ] Update config matrix, PHPDoc/facades/interfaces, generated stubs and CHANGELOG.
- [ ] Commit final production/development assets, manifest paths/checksums and bundle measurements.
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
