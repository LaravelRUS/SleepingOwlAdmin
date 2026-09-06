# Эталонные экраны модернизации UI

Этот inventory задаёт стабильные scenario IDs для browser tests, screenshots и pilot-проверки. Один и тот же PHP fixture рендерится отдельно с темами `adminlte` и `tailwind`; смена темы не меняет данные, PHP DSL или ожидаемые события.

## Общие условия

- Reference routes доступны только в test/demo environment под префиксом `/__sleepingowl/reference`; production provider их не регистрирует.
- Fixtures детерминированы, не обращаются во внешнюю сеть и сбрасываются перед сценарием.
- Обязательные viewport: desktop `1440x900` и mobile `390x844`.
- Обязательные schemes: light и dark. Проверка `system` отдельно подтверждает выбор scheme до первого paint.
- Screenshot сравнивает экран только с baseline той же темы. Между темами требуется behavioral и accessibility parity, а не одинаковые пиксели.
- Все интерактивные элементы доступны с клавиатуры, имеют видимый focus и корректное accessible name.
- Loading, empty, success, validation и network error states вызываются детерминированными fixture-параметрами.

## Матрица экранов

| ID | Экран | Обязательное содержимое | Основные состояния/действия |
| --- | --- | --- | --- |
| `REF-01` | Layout и navigation | header, logo, breadcrumbs, nested sidebar, user menu, messages, content/footer | sidebar open/collapsed, nested item, active route, light/dark/system, success/warning/error message, mobile navigation |
| `REF-02` | Sync table | локальные rows, date/custom-order columns, hidden/width/non-orderable columns, row classes, pagination | sort, global search, page length, empty result, table inside tab, две таблицы на странице |
| `REF-03` | Async DataTable | GET и POST fixtures, server pagination/search/order, responsive columns, processing indicator | load, abort/reload, empty, 422/500 error, state save/restore/clear, auto-update |
| `REF-04` | Table filters/actions/editing | text/select/date/date-range/numeric filters, checkboxes, bulk form, row actions, inline text/select/date/checklist | select one/all, apply/reset filters, submit/cancel/error action, confirm delete, successful/failed inline edit |
| `REF-05` | Select и date/time controls | native select, Vue Multiselect single/multiple, tagging/limits, AJAX/dependent select, date/datetime/range | keyboard navigation, nullable/required/readonly, loading/no results/error, dependency reset, localized display and server value |
| `REF-06` | Files, images и gallery | single/multiple file, single/multiple image, progress, hidden form values, GLightbox gallery | upload success/error/cancel, link insertion, delete, drag reorder, readonly, existing files, dynamic gallery refresh |
| `REF-07` | Tree | nested nodes, controls, max-depth fixture, persisted order endpoint | drag reorder, rejected depth, expand/collapse all, server error/retry, keyboard-accessible controls |
| `REF-08` | Vue islands | env editor, related elements/groups, multiple identical island instances | add/remove/reorder groups, nested widget mount/unmount, validation, independent state, no duplicate initialization |
| `REF-09` | Content widgets | tabs, dropdowns, tooltips, alerts, modal/confirm, WYSIWYG, lazy image, progress | tab restore, dynamic tooltip, dismiss alert, modal focus trap, editor init/destroy, lazy content after redraw |

## Theme coverage

| Theme | Required scenarios | Asset assertion |
| --- | --- | --- |
| `adminlte` | `REF-01`…`REF-09` | AdminLTE 4/Bootstrap 5 present; Tailwind bundle absent |
| `tailwind` | `REF-01`…`REF-09` | Tailwind theme present; Bootstrap/AdminLTE bundles absent |
| `custom-test` | `REF-01`, `REF-02`, `REF-05` plus contract tests | only public core/feature contracts and custom manifest entries; no internal imports |

## Stable fixture rules

- Record ids start at `1001`; visible labels include the id so sorting/filter failures are diagnosable.
- Date fixtures include leap day, month boundary and DST boundary; server values use documented application timezone and ISO transport values.
- Async responses echo `draw` and provide deterministic `recordsTotal`, `recordsFiltered` and `data`.
- Upload fixtures use small local text/image files and never invoke cloud storage.
- Error endpoints return stable status/code/message triples without stack traces.
- User-provided classes and HTML attributes are included in every applicable fixture and must pass through unchanged.
- Every screen exposes loaded logical manifest entries to the test harness, without relying on hashed physical filenames.

## Evidence required to close a scenario

- Browser assertions for behavior and emitted public events.
- Accessibility scan with documented exceptions only.
- Desktop and mobile screenshots for each built-in theme and color scheme.
- Assertion that only selected theme and used feature assets were requested.
- PHP render/response contract test for the fixture that feeds the screen.

