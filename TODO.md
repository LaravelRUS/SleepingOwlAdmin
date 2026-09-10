# Актуальные задачи SleepingOwlAdmin

Состояние на 2026-09-10. Это только живой backlog: завершённые migration-планы
не являются источником новых задач. Текущую границу системы задаёт
[`architecture.md`](architecture.md), а при расхождении документации первичны
публичные contracts и executable tests. Детальные планы уточняют порядок работ,
но перед выполнением должны быть сверены с этой архитектурой.

## Обязательные архитектурные границы

- PHP-first DSL, transport, validation и persistence остаются server-owned.
  Blade владеет видимой разметкой, ARIA и конечными classes/options, а JavaScript
  подключается только к документированным `data-*`, ARIA и field-name hooks.
- `core` остаётся headless; theme-neutral presentation принадлежит `shared:ui`,
  общее browser behavior — `shared:features`, framework/vendor presentation —
  только выбранной теме или её явному feature adapter.
- Built-in theme выбирается canonical lower-kebab name из
  `sleeping_owl.template.themes`. `ThemeInterface` не содержит `id()`; scoped
  entries `theme:<name>` и `feature:<feature>:theme:<name>` формирует runtime.
- Изменение публикуемых frontend sources завершается синхронизацией готовых
  production/development profiles, manifest versions/checksums и проверкой
  AdminLTE, Shadcn и framework-free `empty` fixture. Composer-consumer не должен
  запускать Node.js или frontend compiler.
- Compatibility alias/marker сохраняется только на документированной границе и
  не возвращает jQuery, global Vue/DataTable, Select2 runtime или theme classes в
  PHP и shared feature logic.

## Текущий checkpoint

- [ ] Завершить изолированный Tom Select adapter для popup
      `AdminColumnEditable::select` в `shared:features/table`: canonical Blade
      выводит native `<select>`, driver владеет mount/focus/read/clear/disable/
      destroy lifecycle, а shared CSS — vendor shell через `--soa-*` tokens.
      Обычные `Select`, `SelectAjax` и `DependentSelect` остаются Vue Multiselect
      islands. Не допускать global/plugin wrapper, jQuery, theme imports или
      повторный Vue mount; закрыть unit, render и browser matrix во всех трёх
      темах и обоих asset profiles.

## Platform backlog

- [ ] Закрыть P1 parity framework-free `empty` fixture по
      [`ADMIN_EMPTY_THEME_SHARED_PLAN.md`](ADMIN_EMPTY_THEME_SHARED_PLAN.md):
      dashboard/login/thumbnails, alerts и asset-health, card
      collapse/maximize, table shell/filters, select/related/upload/WYSIWYG form
      shells. Для каждой области сначала назначить единственного owner, затем в
      том же checkpoint удалить дубли из AdminLTE/Shadcn и пройти cross-theme
      browser gate.
- [ ] После P1 закрыть P2 `empty` parity: modal/notification presentation и
      capability contract, удалить оставшиеся Bootstrap presentation classes из
      canonical Blade, расширять `EmptyTheme::capabilities()` только после
      browser parity соответствующего feature.
- [ ] Воспроизвести и исправить возврат формы в корень после
      «Сохранить»/«Сохранить и закрыть». `_redirectBack` и fallback на
      `getDisplayUrl()` должны остаться server-owned form contract; добавить
      regression tests для store/update и обоих submit actions.
- [ ] Обновить локальный CKEditor 5 как WYSIWYG feature adapter: зафиксировать
      exact version/plugin/license inventory, синхронизировать config, переводы
      и upload adapter, исключить editor runtime из `core` и theme bundles,
      пересобрать оба profiles и проверить no-build publication.
- [ ] Добавить timezone/DST matrix для date/daterange-фильтров DataTables.
      Browser передаёт локальное значение по общему filter contract, а
      нормализация в application timezone выполняется на server boundary и не
      зависит от timezone PHP-процесса или выбранной темы.
- [ ] Определить публичный contract размеров preview для image/images: какие
      display/form elements его поддерживают, какие значения валидирует PHP и
      как сохраняется aspect ratio. PHP должен передавать семантические options,
      Blade — финальные attributes/classes, а геометрия и visual defaults должны
      находиться в shared/theme CSS. После решения добавить API, render tests и
      cross-theme browser tests.

## Следующие theme tracks

- [ ] До реализации полностью переутвердить
      [`ADMIN_TABLER_THEME_PLAN.md`](ADMIN_TABLER_THEME_PLAN.md) под действующий
      name-driven contract: canonical name `tabler` хранится в config/registry,
      `ThemeInterface` не получает `id()`, built-in views наследуют canonical
      base и переопределяют только реальные markup differences, а runtime сам
      добавляет обязательные shared и scoped theme entries. Удалить ссылки на
      архивный общий migration plan и сверить checklist с
      [`ADMIN_ADDITIONAL_THEMES_PLAN.md`](ADMIN_ADDITIONAL_THEMES_PLAN.md).
- [ ] После архитектурного rebase Tabler-плана выполнить только его checkpoint
      0: exact upstream/package, Bootstrap compatibility, dependency/license
      provenance, component/capability inventory и доказанный минимум vendor JS.
      Реализацию theme skeleton начинать отдельным checkpoint.

## Post-release

- [ ] Перейти с Laravel Mix/Webpack на Vite, не меняя runtime contract: сохранить
      logical entry matrix, одинаковый состав production/development profiles,
      versioned manifest с checksums, готовые package assets и no-build Composer
      consumer workflow. Отдельно зафиксировать bundle/license/audit delta до и
      после миграции.

## Требует отдельного решения владельца

- [ ] Запускать pilot в `D:\domains\laluna.kit` только после отдельного
      разрешения на изменение внешнего проекта.
- [ ] Решить, нужен ли custom avatar field/fallback для
      `AdminColumn::gravatar`; не добавлять avatar-specific presentation в PHP
      column contract без утверждённого use case.
- [ ] Решить, нужен ли отдельный form element для карт и какой внешний provider,
      data model, privacy и asset boundary он использует.
- [ ] Уточнить ожидаемый browser show/hide contract из
      [issue #200](https://github.com/LaravelRUS/SleepingOwlAdmin/issues/200); он
      не равен server-side `setVisible()` и требует отдельного public lifecycle
      contract.

## Закрытый baseline — не возвращать в backlog

- AdminLTE 4/Bootstrap 5 и Tailwind 4/Shadcn поставляются как две изолированные
  built-in темы; framework-free `empty` остаётся acceptance fixture, а не
  продуктовой темой.
- Первый semantic shared UI acceptance gate закрыт; его исторический план
  находится в
  [`docs/old-plans/ADMIN_SHARED_UI_STYLES_PLAN.md`](docs/old-plans/ADMIN_SHARED_UI_STYLES_PLAN.md).
  Оставшаяся parity ведётся только в `ADMIN_EMPTY_THEME_SHARED_PLAN.md`.
- SelectAjax и DependentSelect используют общий Vue Multiselect island;
  `setSelect2()` сохранён только как compatibility API. Tom Select разрешён
  только в явно описанном inline-editor adapter и поэтому не подлежит удалению
  как «неиспользуемая dependency».
- Frontend использует native feature drivers, Vue 3 islands и DataTables 3 без
  jQuery, Vue 2 globals, global DataTable, X-editable и Select2 runtime.
- Logical manifests, production/development profiles, `sleepingowl:update` и
  `sleepingowl:update --check` образуют действующий no-build distribution
  contract.
- Visibility conditions, section/provider/extension stubs, boolean inline
  toggle, timezone fallback на `app.timezone` и перенесённая пользовательская
  документация уже закрыты текущей реализацией.
- `AdminColumn::timestamp` и `AdminColumn::textaddon` не существуют;
  `hidden-sm`, `.last`, `.badge-list-warning`, `.th-center` и другие
  framework-specific helpers не являются cross-theme API;
  `setVisibilityCondition()` остаётся compatibility alias для `setVisible()`.
