# План встроенной TailwindTheme на shadcn/ui

## Статус и границы

- Статус: **основа выбрана, структура создания зафиксирована; реализация ещё не начата**.
- Выбранная основа: **shadcn/ui** как registry component recipes и визуальный язык TailwindTheme. Это не подключение React-приложения и не новый browser runtime.
- Следующий checkpoint до начала полноценной реализации: зафиксировать точный upstream snapshot/CLI version, license/provenance, список используемых registry components и допустимый способ обновления vendored recipes.
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
4. **SleepingOwl view mapping.** Полный набор существующих logical views зеркалируется под TailwindTheme и собирается из primitives; application/vendor overrides сохраняют прежний приоритет.
5. **Feature presentation adapters.** Tabs, dropdown, tooltip, sidebar, tree, DataTables, forms, uploads и lightbox получают только theme-owned Sass/Blade presentation. Transport, state и lifecycle не копируются из core/features.
6. **Precompiled delivery.** Tailwind scan выполняется maintainer build-ом по package Blade/Vue sources. В Composer artifact входят готовые production/development assets, manifest и checksums.

### Планируемая структура файлов

```text
src/Themes/
└── TailwindTheme.php

resources/views/themes/tailwind/
├── components/
│   ├── ui/                 # выбранные shadcn-derived Blade primitives
│   └── patterns/           # admin shell, toolbar, empty/error states
└── default/                # зеркало стабильных logical view paths
    ├── _layout/
    ├── _partials/
    ├── column/
    ├── display/
    ├── form/
    ├── helper/
    └── pages/

resources/frontend/themes/tailwind/
├── index.js                # только theme runtime composition, если требуется
├── tailwind.input.css      # только Tailwind directives/source configuration
└── styles/
    ├── _colors.scss
    ├── _variables.scss
    ├── _custom-properties.scss
    ├── _shadcn-theme.scss  # aliases shadcn/Tailwind → --soa-*, без color literals
    ├── _base.scss
    ├── _components.scss
    └── theme.scss

resources/frontend/features/*/themes/tailwind/styles/
└── *.scss                  # presentation adapters рядом с feature ownership

tests/Feature/Themes/
└── TailwindThemeTest.php

tests/frontend/browser/
└── tailwind-*.spec.js

docs/modernization/
├── shadcn-component-inventory.md
└── tailwind-theme.md
```

`tailwind.input.css` является только build-tool input. Все написанные вручную rules и значения остаются в Sass; generated Tailwind output публикуется сборкой и вручную не редактируется.

Существующие минимальные `resources/frontend/themes/tailwind` и `features/*/themes/tailwind` являются contract/presentation stubs, созданными для проверки изоляции headless core. Они не считаются готовой TailwindTheme и будут поэтапно приведены к выбранным shadcn recipes без изменения feature behavior.

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
- [ ] Зафиксировать точный shadcn/ui snapshot/CLI version, лицензию, provenance и допустимый способ vendor updates.
- [ ] Создать `shadcn-component-inventory.md`: registry name, upstream snapshot, local Blade owner, required states и причина включения каждого recipe.
- [ ] Подтвердить, что выбранные recipes не требуют React/Radix runtime и сопоставлены существующим native/Vue feature behavior.
- [ ] Составить mapping существующих SleepingOwlAdmin views/components на template primitives без копирования feature behavior.
- [ ] Зафиксировать визуальное направление, typography, palette и один отличительный design motif до написания theme CSS.
- [ ] Подтвердить, что лицензия допускает поставку готового production CSS внутри Composer artifact.

## 1. Создать прямую TailwindTheme

- [ ] Добавить `TailwindTheme`, напрямую реализующую `ThemeInterface`, с id `tailwind`, отдельным view namespace/capabilities и существующим отдельным `shared:icons` bundle.
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
| 2026-09-08 | Выбор shadcn/ui и структура | По решению владельца shadcn/ui выбран как источник проверяемых recipes и визуального языка, без React/Next/Radix runtime. Зафиксированы владельцы слоёв, Blade-first mapping, единый `--soa-*` token source, общий Font Awesome entry, дерево файлов и восемь последовательных checkpoint-ов. Код темы и зависимости ещё не добавлялись; следующий пункт — upstream snapshot/license/component inventory. | текущий commit |
