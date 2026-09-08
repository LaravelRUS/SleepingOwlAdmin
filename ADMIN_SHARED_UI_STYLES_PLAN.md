# План общих стилей постоянных UI-блоков

## Статус и правила

- Статус: **inventory готов; реализация не начата**.
- Следующий checkpoint: собрать self-contained каталоги тем, отдельный override layer и общий asset layer.
- Общие декларации поставляются отдельным logical entry `shared:ui`, автоматически подключаемым для любой `ThemeInterface`; headless `core` не получает presentation.
- Общий CSS может использовать только semantic `soa-*` classes, behavior hooks и canonical `--soa-*` variables. Тема задаёт значения tokens и действительно отличающиеся overrides.
- В общем слое запрещены Bootstrap/AdminLTE/Tailwind imports, vendor selectors и literal palette. Одинаковые structural rules удаляются из theme adapters.
- Список общих элементов открыт для дополнений; новый элемент сначала получает отдельный checklist с обязательными states, затем переносится в shared layer.
- После каждого пункта: `[x]`, узкая проверка, запись в журнал и отдельный commit без чужих изменений.

## Целевая структура

```text
resources/
├── core/
│   ├── scripts/                  # headless API/runtime
│   └── styles/                   # только behavior/accessibility contracts
├── shared/                       # используется всеми темами
│   ├── scripts/
│   ├── styles/                   # shared:ui
│   └── features/<feature>/
│       ├── scripts/              # общий feature driver
│       └── styles/               # общая feature geometry
├── themes/<theme-id>/            # переносимая папка конкретной темы
│   ├── views/                    # полный Blade namespace темы
│   ├── scripts/                  # runtime выбранной темы
│   ├── styles/                   # tokens и собственная presentation
│   ├── features/<feature>/
│   │   ├── scripts/              # adapter только этой темы
│   │   └── styles/
│   └── README.md                 # contract, capabilities и build/publication
└── theme-overrides/<theme-id>/   # изменения и исправления конкретной темы
    ├── scripts/
    ├── styles/
    └── README.md                 # причина, target version и условие удаления
```

Сторонняя Composer-тема повторяет тот же переносимый unit в своём package:

```text
vendor-theme/
├── src/<ThemeClass>.php
├── resources/
│   ├── views/
│   ├── scripts/
│   ├── styles/
│   └── features/
├── public/                       # готовые no-build assets
└── asset-manifest.json           # logical manifest fragment
```

Application регистрирует class и manifest fragment через публичный theme contract, не копируя sources внутрь SleepingOwlAdmin.

`theme-overrides/<theme-id>` находится вне переносимой папки темы: он содержит локальные изменения/исправления, применяется только к выбранной теме и всегда идёт последним среди package styles/scripts. Обычные компоненты и исправления, являющиеся частью самой темы, остаются внутри `themes/<theme-id>`.

Публичные output paths, logical ids и Blade logical view names при перемещении sources не меняются.

## Порядок подключения

CSS: `core -> shared:ui -> shared feature -> selected theme -> selected theme feature adapters -> selected theme overrides -> application CSS`.

JavaScript: `core -> shared runtime -> selected theme runtime -> shared feature drivers -> selected theme adapters -> selected theme overrides -> modules/application scripts`.

Manifest dependencies являются единственным источником порядка; Blade не сортирует и не подключает эти файлы вручную.

## 0. Общая инфраструктура

- [x] Провести source inventory постоянных блоков и их дубликатов в AdminLTE/Tailwind.
- [x] Зафиксировать тему как self-contained unit: `views`, `scripts`, `styles`, `features` и документация лежат в одном `themes/<theme-id>`.
- [x] Отделить локальные изменения/исправления от переносимой темы в `theme-overrides/<theme-id>`.
- [ ] Создать каталоги `resources/core`, `resources/shared`, `resources/themes/<theme-id>` и `resources/theme-overrides/<theme-id>` по целевой структуре.
- [ ] Переместить общий core/runtime и feature sources без изменения public output paths и logical ids.
- [ ] Переместить Blade namespace, scripts, styles и все adapters конкретной темы в один `themes/<theme-id>`; удалить прежние разбросанные paths после проверки imports/resolution.
- [ ] Ввести отдельный logical entry `theme:<id>:overrides`, подключаемый только для выбранной темы и после всех её base/feature entries.
- [ ] Расширить custom-theme scaffold и `ThemeRegistry`: внешний package регистрирует self-contained theme root и готовый manifest fragment без копирования в package.
- [ ] Добавить no-build contract: сторонняя Composer-тема устанавливается с готовыми assets без Node.js и package source edits.
- [ ] Зафиксировать для каждого файла один owner: `core`, `shared`, `theme` или `theme override`; перекрёстные копии запрещены.
- [ ] Проверить одинаковый детерминированный порядок CSS и JavaScript в production/development manifests.
- [ ] Создать `resources/shared/styles/shared-ui.scss` и logical entry `shared:ui` в обоих asset profiles.
- [ ] Зафиксировать cascade order `core -> shared -> feature -> theme`; theme override должен быть явным и минимальным.
- [ ] Автоматически регистрировать `shared:ui` ровно один раз для AdminLTE, Tailwind и любой custom theme.
- [ ] Добавить одинаковые semantic classes в AdminLTE/Tailwind Blade; legacy classes оставить compatibility aliases.
- [ ] Добавить static gate: в theme SCSS нет копий перенесённых structural selectors.

## 1. Постоянный application shell

- [ ] `app-wrapper` / `.soa-app`: box sizing, минимальная высота и базовая grid/flex geometry.
- [ ] `app-header` / `.soa-header`: позиция, высота, alignment, списки и responsive geometry.
- [ ] Кнопки `app-header`: `.soa-header-action` / `.soa-icon-button`, одинаковые hit area, alignment, disabled и focus states.
- [ ] `app-sidebar` / `.soa-sidebar`: размеры, flex/overflow, transition, collapsed/mobile geometry и overlay; цвета остаются tokens темы.
- [ ] Sidebar navigation structure: scroll wrapper, list reset, item/link alignment, arrow placement и hidden tree state.
- [ ] `app-main`, page heading и content container: min-width, placement, responsive paddings.
- [ ] `app-footer` / `.soa-footer`: placement, inner/copy/version layout, wrapping и responsive paddings.
- [ ] Asset-health block внутри footer: status/command geometry; severity colors остаются tokens темы.

## 2. Общие controls и containers

- [ ] `.soa-button`: reset, inline-flex geometry, min-size, padding, focus, disabled и size variants.
- [ ] `.soa-icon-button`: square hit area и icon alignment, включая header/editor/scroll controls.
- [ ] Button groups/toolbars: horizontal/vertical layout, wrapping и gaps.
- [ ] `.soa-input`, `.soa-select`, `.soa-textarea`, checkbox/radio/switch: sizing, font inheritance, focus и disabled geometry.
- [ ] Input group, addon, label/help/error layout.
- [ ] `checkbox`: control/label/group geometry и checked, unchecked, indeterminate, focus, disabled, readonly, help/error states.
- [ ] `image`: preview, upload/replace/remove/download/insert actions, progress, empty, error и readonly states.
- [ ] `images`: gallery grid, item preview/order/actions, upload queue/progress, empty, error и readonly states.
- [ ] `file`: file icon/name/metadata, browse/upload/replace/remove/download actions, progress, empty, error и readonly states.
- [ ] `files`: file list/grid, item actions, upload queue/progress, empty, error и readonly states.
- [ ] Card shell: header/body/footer layout, collapsed/maximized geometry; palette/shadow остаются tokens темы.
- [ ] Dialog shell: viewport sizing, form/actions layout и backdrop hook; palette/shadow остаются tokens темы.

## 3. Все inline editable поля

- [ ] Editable trigger: `.soa-inline-editable`, textarea content и `data-max-rows` clamp.
- [ ] Inline/popup root: `.soa-inline-editor`, dialog sizing/open state/backdrop и form grid.
- [ ] Общая control geometry для text, textarea, number, date и datetime.
- [ ] Select/Multiselect geometry и место под clear control.
- [ ] Checkbox, boolean и checklist layout/scrolling.
- [ ] Range slider, output и numeric companion layout.
- [ ] Clear/clear-all, submit/cancel buttons, error и `aria-busy` states.
- [ ] Удалить дубли `_inline-editor.scss` из AdminLTE/Tailwind; в adapters оставить только `--soa-inline-editor-*` values и реальные skin overrides.

## 4. Fixed page controls

- [ ] Унифицировать Blade markup `scrolltotop` / `scrolltobottom`: `.soa-scroll-control`, `href`, ARIA и page-end anchor во всех встроенных темах.
- [ ] Вынести position, stack order, hit area, icon alignment и focus в `shared:ui`.
- [ ] Вынести общие `show` / `hide` visibility states; theme adapters оставляют только token-driven surface/border/shadow/color.
- [ ] Проверить top/bottom placement на desktop/mobile и отсутствие перекрытия footer/inline editor.

## 5. Acceptance

- [ ] AdminLTE, Tailwind и framework-free fixture получают `shared:ui` один раз в production/development.
- [ ] Browser matrix подтверждает одинаковую geometry header/sidebar/footer/buttons/editables/scroll controls; различаться могут только theme tokens/явные overrides.
- [ ] Keyboard focus, reduced motion, responsive sidebar и scroll controls проходят узкий Chromium gate.
- [ ] PHP manifest/runtime tests подтверждают порядок assets и custom-theme workflow.
- [ ] Production/development manifests, MD5/SHA-256 и no-build publication согласованы.
- [ ] Stylelint и forbidden framework/literal-color scan проходят для общего layer.
- [ ] Документация custom theme описывает обязательный `shared:ui` contract и допустимые overrides.

## Журнал выполнения

| Дата | Checkpoint | Результат | Commit |
| --- | --- | --- | --- |
| 2026-09-09 | Inventory и source layout | Выделены четыре приоритетных группы: application shell, common controls, все inline editable поля и fixed scroll controls. Зафиксировано разделение `core`, общего `shared`, отдельной папки каждого `themes/<id>` и последнего `themes/<id>/overrides` для изменений/исправлений конкретного шаблона. CSS/JS получают детерминированный manifest order; public paths/logical ids сохраняются. Код/assets не менялись, tests не запускались. | текущий commit |
| 2026-09-09 | Дополнение component inventory | В общий design checklist отдельными пунктами добавлены `checkbox`, `image`, `images`, `file` и `files` со всеми interactive/loading/empty/error/readonly states. Список остаётся открытым для следующих дополнений. Код/assets не менялись, tests не запускались. | текущий commit |
| 2026-09-09 | Self-contained theme structure | Структура скорректирована для сторонних авторов: каждая тема является переносимым unit с собственными views/scripts/styles/features, а локальный `theme-overrides/<id>` вынесен наружу и загружается последним. Добавлены external Composer theme, manifest fragment, scaffold и no-build contracts; public paths/logical ids/view names сохраняются. Код/assets не менялись, tests не запускались. | текущий commit |
| 2026-09-09 | Упрощение resource tree | Лишний уровень `resources/frontend` удалён из целевой структуры: headless runtime находится в `resources/core`, общий UI — в `resources/shared`, темы и overrides — рядом. Во внешнем theme-package также используется прямой `resources/{views,scripts,styles,features}` без дублирующего `resources/theme`. Код/assets не менялись, tests не запускались. | текущий commit |
