# Актуальные задачи SleepingOwlAdmin

Состояние на 2026-09-09. Этот файл содержит только живой backlog. Детальные
архитектурные checklist находятся в отдельных `ADMIN_*_PLAN.md`; их статусы
считаются первичными.

## Текущий package backlog

- [ ] Завершить оставшуюся часть semantic UI layer по
      [`ADMIN_SHARED_UI_STYLES_PLAN.md`](ADMIN_SHARED_UI_STYLES_PLAN.md): common
      controls, form fields, uploads, inline editors и acceptance gate. Общий
      application shell и fixed scroll controls уже закрыты.
- [ ] Воспроизвести и исправить возврат формы в корень после
      «Сохранить»/«Сохранить и закрыть»; добавить regression test для `_redirectBack`
      и fallback на `getDisplayUrl()`.
- [ ] Обновить и пересобрать локальный CKEditor 5, синхронизировать версию и
      плагины с конфигурацией, проверить загрузку, переводы и upload adapter.
- [ ] Добавить timezone/DST matrix для date/daterange-фильтров DataTables и
      исправить преобразование, если введённая пользователем локальная дата сейчас
      интерпретируется в timezone PHP-процесса.
- [ ] Определить контракт image/images helper для размеров preview: какие
      display/form элементы поддерживаются, допустимы ли произвольные CSS-значения
      и как сохраняется aspect ratio. После решения добавить API и tests.
- [ ] Удалить неиспользуемую frontend dependency `tom-select`, обновить lock-файл
      и прогнать frontend gate. Текущие select controls используют
      `vue-multiselect`.
- [ ] Отдельным post-release checkpoint перейти с Laravel Mix на Vite, сохранив
      logical entries, production/development profiles, versioned manifest и
      no-build consumer workflow.

## Требует отдельного решения владельца

- [ ] После завершения `shared:ui` переутвердить и переписать
      [`ADMIN_TABLER_THEME_PLAN.md`](ADMIN_TABLER_THEME_PLAN.md) под текущий
      name-driven theme contract; существующий план буквально не выполнять.
- [ ] Запускать pilot в `D:\domains\laluna.kit` только после отдельного
      разрешения на изменение внешнего проекта.
- [ ] Решить, нужен ли custom avatar field/fallback для `AdminColumn::gravatar`.
- [ ] Решить, нужен ли отдельный form element для карт.
- [ ] Уточнить ожидаемый browser show/hide contract из
      [issue #200](https://github.com/LaravelRUS/SleepingOwlAdmin/issues/200); он не
      равен server-side `setVisible()`.

## Закрыто текущей реализацией

- SelectAjax локализован и работает через общий Vue Multiselect island.
- `DisplayTab`, `DisplayTabbed`, form elements и table columns поддерживают
  visibility conditions.
- Frontend sources разделены на `resources/css` и `resources/js`; готовы
  logical manifests и production/development profiles.
- Section/provider/extension stubs обновлены; доступна команда
  `sleepingowl:extension:make`.
- DependentSelect переведён с Select2 runtime на Vue Multiselect; `setSelect2()`
  сохранён только как compatibility API.
- jQuery удалён из runtime; штатный frontend использует AdminLTE 4,
  Bootstrap 5, Vue 3 islands и DataTables 3.
- `sleeping_owl.timezone = null` использует `app.timezone`.
- `AdminColumnEditable::boolean` переключается прямым кликом без popup.
- Документация visibility, editable columns, filters, column modifiers,
  messages, WYSIWYG collapse и DataTables auto-update перенесена в
  [`DOCUMENTATION.md`](DOCUMENTATION.md).

## Упразднено или заменено

- `AdminColumn::timestamp` и `AdminColumn::textaddon` не существуют. Не путать с
  form elements `AdminFormElement::timestamp()` и
  `AdminFormElement::textaddon()`; создавать display-варианты можно только как
  отдельные утверждённые features.
- `hidden-sm`, `.last`, `.badge-list-warning`, `.th-center` и похожие
  framework-specific helpers не являются новым cross-theme API. Для нового
  кода использовать semantic `soa-*` hooks, Bootstrap/Tailwind classes только
  внутри выбранной темы и application CSS для собственных presentation rules.
- `setVisibilityCondition()` не помечен deprecated: это compatibility alias для
  `setVisible()`. Новому коду следует использовать `setVisible()`.
- Старые пункты про X-editable, Select2 runtime, ENV editor, AdminLTE 3,
  Bootstrap 4, Vue 2 и Laravel 5–9 больше не относятся к текущей ветке.
