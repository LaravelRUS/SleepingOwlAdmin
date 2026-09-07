# Отложенный план встроенной TailwindTheme

## Статус и границы

- Статус: **отложен по решению владельца проекта**.
- Условие возобновления: выбран и зафиксирован подходящий готовый admin template с совместимой лицензией; до этого код TailwindTheme, её Blade views и новые зависимости не добавляются.
- Основа: завершённый публичный contract из [`ADMIN_UI_MODERNIZATION_PLAN.md`](ADMIN_UI_MODERNIZATION_PLAN.md) — headless core, `ThemeInterface`, logical asset manifest, Blade-first views, Vue 3 islands, DataTables 3 и no-build publication.
- Эта тема не блокирует основной major-релиз и не меняет compatibility contract существующей `AdminLTETheme`.
- Каждый самостоятельный пункт выполняется тем же циклом: реализация, релевантные проверки, обновление этого файла, отдельный checkpoint-коммит и чистое дерево.

## 0. Выбрать основу темы

- [ ] Сравнить готовые Tailwind admin templates по лицензии, активности проекта, accessibility, dark mode, sidebar/navigation, form/table coverage и совместимости с Tailwind 4.
- [ ] Зафиксировать выбранный template, точную версию, лицензию и допустимый способ vendor updates.
- [ ] Составить mapping существующих SleepingOwlAdmin views/components на template primitives без копирования feature behavior.
- [ ] Зафиксировать визуальное направление, typography, palette и один отличительный design motif до написания theme CSS.
- [ ] Подтвердить, что лицензия допускает поставку готового production CSS внутри Composer artifact.

## 1. Создать прямую TailwindTheme

- [ ] Добавить `TailwindTheme`, напрямую реализующую `ThemeInterface`, с id `tailwind`, отдельным view namespace, capabilities и theme-owned icons.
- [ ] Объявить `shared:icons`, `theme:tailwind` и только реально поддерживаемые `feature:<id>:theme:tailwind` logical entries.
- [ ] Реализовать initialize/runtime composition через публичный logical asset registrar без imports внутренних файлов AdminLTE.
- [ ] Добавить выбор TailwindTheme существующим config key `sleeping_owl.template` и документированный service-provider hook.
- [ ] Запретить silent fallback к AdminLTE при ошибке конфигурации TailwindTheme.

## 2. Реализовать Blade-first presentation

- [ ] Создать полный theme-owned набор layout, navigation, display, table, filter, form, action, widget, auth и helper views.
- [ ] Сохранить логические пути views и приоритет application overrides.
- [ ] Передавать Tailwind classes/options Vue islands только из Blade props; не зашивать utilities в Vue/feature JavaScript.
- [ ] Сохранить публичные `data-dismiss`, `data-toggle`, `data-widget`, field names, ARIA и остальные documented behavior hooks.
- [ ] Проверить пользовательские HTML attributes/classes и hook-compatible изменённую вложенность без frontend rebuild.

## 3. Собрать независимые Tailwind assets

- [ ] Зафиксировать поддерживаемую Tailwind 4.x версию и build dependencies.
- [ ] Добавить `tailwind.input.css`, preset/source/content configuration и отдельный theme build entry.
- [ ] Определить theme-owned `_colors.scss`, `_variables.scss`, handwritten `theme.scss` и публичные `--soa-*` defaults; generated utility layer не редактировать вручную.
- [ ] Реализовать dark mode через переопределение custom properties на theme root/container без копии component stylesheet.
- [ ] Поддержать валидированный `sidebar_background_color` через `--soa-sidebar-bg`; `null` использует default темы.
- [ ] Собрать полный стандартный production CSS и development profile; consumer не устанавливает Tailwind CLI и не выполняет content scan.
- [ ] Доказать, что `theme:tailwind` и её adapters не содержат Bootstrap/AdminLTE CSS, JavaScript, fonts или transitive runtime dependencies.

## 4. Закрыть feature presentation

- [ ] Реализовать alerts, dropdowns, tooltips, tabs, sidebar/tree, messages и notifications.
- [ ] Реализовать DataTables 3 и Responsive presentation, filters, pagination, processing/error и inline editing.
- [ ] Реализовать date/time/daterange, select/multiselect, uploads, gallery/lightbox, WYSIWYG wrappers и related elements.
- [ ] Реализовать tree success/error notification adapter через публичные native events без копии tree driver logic.
- [ ] Добавить asset health footer partial: `role="status"`, локализованный текст, Sass/custom-property presentation, без modal/toast.

## 5. Customisation и no-build workflow

- [ ] Документировать preset/source/content для проектов, которым нужны произвольные utilities в переопределённых Blade views.
- [ ] Документировать дополнительный CSS и простые theme settings/custom properties без пересборки core.
- [ ] Явно описать границу: стандартная тема работает без Node.js, а новые произвольные utilities требуют отдельного пользовательского CSS build.
- [ ] Поставлять готовые production/development assets и checksums через существующий `sleepingowl:update`.
- [ ] Переключение между AdminLTE и Tailwind через config не требует изменения package sources или package rebuild.

## 6. Acceptance matrix

- [ ] Один PHP display/form сохраняет behavior в AdminLTE и Tailwind, меняется только theme-owned presentation.
- [ ] Выбор Tailwind не регистрирует ни один AdminLTE/Bootstrap asset; выбор AdminLTE не регистрирует Tailwind asset.
- [ ] Core работает без CSS обеих тем и не содержит class resolver.
- [ ] Все feature drivers проходят общий browser contract в Tailwind в пределах объявленных capabilities.
- [ ] Light/dark mode, sidebar state/color, keyboard focus, reduced motion и responsive layout проходят browser/visual smoke tests.
- [ ] Asset version match/mismatch, locale fallback и отсутствие лишней footer-разметки покрыты PHP/browser tests.
- [ ] Чистое Laravel-приложение без Node.js устанавливает и запускает TailwindTheme только через Composer/PHP/Artisan.
- [ ] Production/development manifests согласованы, checksums валидны, bundle sizes измерены отдельно.
- [ ] README, theme guide, migration guide, config matrix и CHANGELOG обновлены.

## Журнал выполнения

| Дата | Checkpoint | Результат | Commit |
| --- | --- | --- | --- |
| 2026-09-07 | Разделение планов | TailwindTheme вынесена из release-blocking checklist основного плана; реализация остаётся отложенной до выбора готового шаблона. | текущий commit |
