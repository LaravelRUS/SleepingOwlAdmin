# Оценка перехода Blade на default + theme/application overrides

## Резюме решения

Текущий полный mirror `default` внутри каждой темы следует заменить каскадом
путей Laravel View Finder:

```text
application override
    -> override выбранной темы
        -> package default
```

Для встроенных тем базовым физическим деревом становится
`resources/views/default`. Оно сохраняет нынешнее поведение AdminLTE и все
публичные логические имена `sleeping_owl::default.*`. Тема хранит Blade только
тогда, когда её реализация действительно отличается от base. Отсутствие файла
в теме является штатным наследованием, а не ошибкой и не поводом создавать
bridge/include.

Механизм должен использовать namespace hints Laravel, то есть ту же модель,
что и application overrides, но package не должен копировать theme-файлы в
`resources/views/vendor` приложения. Приоритет проекта остаётся первым.

Рекомендуемый первый scope: встроенные `AdminLTETheme` и `TailwindTheme`, без
изменения `ThemeInterface`, `TemplateInterface`, логических view names и
application override paths. Поддержку наследования для внешних theme packages
лучше добавить как совместимый opt-in поверх того же механизма, не меняя
поведение уже существующих полных внешних тем.

## Что есть сейчас

На 2026-09-09 оба каталога содержат одинаковый набор из 136 логических путей:

```text
resources/views/themes/adminlte/default  136 Blade, 2719 строк
resources/views/themes/shadcn/default    136 Blade, 2713 строк
```

Сравнение выполнено по одинаковым relative paths. После игнорирования CRLF/LF,
форматирующего whitespace и пустых строк без Blade/HTML-содержимого:

- 37 файлов функционально одинаковы и могут наследоваться из base;
- 99 файлов содержат реальные различия и остаются Shadcn overrides;
- уникальных logical paths только в одной теме сейчас нет;
- после первого этапа два `default`-дерева уменьшаются с 272 до 235 файлов:
  136 base + 99 overrides;
- удаляется 37 файлов и около 318 строк из Shadcn mirror, то есть 13,6% файлов
  двух текущих `default`-деревьев;
- 27 файлов `resources/views/themes/shadcn/components` являются настоящими
  theme-owned primitives и в эту дедупликацию не входят.

Распределение по группам:

| Группа | Base paths | Совпадают | Реальные Shadcn overrides |
| --- | ---: | ---: | ---: |
| `_layout` | 2 | 0 | 2 |
| `_partials` | 15 | 2 | 13 |
| `column` | 53 | 24 | 29 |
| `dashboard.blade.php` | 1 | 0 | 1 |
| `display` | 15 | 3 | 12 |
| `form` | 46 | 6 | 40 |
| `helper` | 3 | 2 | 1 |
| `pages` | 1 | 0 | 1 |
| **Итого** | **136** | **37** | **99** |

Вывод из инвентаризации: каскад нужен архитектурно и уже убирает 37
бессодержательных копий, но он не превращает оставшиеся 99 файлов в дубли.
Большинство из них действительно владеет другой разметкой, классами, Shadcn
components или presentation props. Их механически объединять нельзя.

## Целевая физическая структура

```text
resources/views/
├── default/                         # полный base contract, AdminLTE-compatible
│   ├── _layout/
│   ├── _partials/
│   ├── column/
│   ├── display/
│   ├── form/
│   ├── helper/
│   └── pages/
├── features/                        # существующие theme-neutral feature views
├── shared/                          # существующие shared views
└── themes/
    └── shadcn/
        ├── components/              # theme-only primitives, без base аналога
        └── default/                 # только 99 отличающихся overrides
```

Отдельный `resources/views/themes/adminlte/default` после переноса не нужен:
base и есть совместимая AdminLTE presentation. Пустой каталог или marker-файл
оставлять не следует. Если позднее у AdminLTE появится вариант, отличный от
base contract, для него можно зарегистрировать такой же override root.

`shared` и `features` не надо сливать в `default`: у них уже есть отдельная
граница ownership. Однострочные compatibility bridges в base можно сохранить,
поскольку они удерживают исторические `default.*` names; их не следует снова
копировать в тему.

## Разрешение view paths

### AdminLTE

```text
<app view path>/vendor/sleeping_owl/default/form/element/text.blade.php
    -> <package>/resources/views/default/form/element/text.blade.php
```

Namespace остаётся `sleeping_owl::default`. Существующий project override не
меняется.

### Shadcn

```text
<app view path>/vendor/sleeping_owl_shadcn/default/form/element/text.blade.php
    -> <package>/resources/views/themes/shadcn/default/form/element/text.blade.php
        -> <package>/resources/views/default/form/element/text.blade.php
```

Namespace остаётся `sleeping_owl_shadcn::default`, поэтому существующие
Shadcn-specific application overrides также не переезжают. Theme root должен
идти перед base root, но после всех `view.paths/*/vendor/<namespace>`.

Для встроенной темы это можно зарегистрировать одним массивом hints:

```php
$this->loadViewsFrom([
    __DIR__.'/../../resources/views/themes/shadcn',
    __DIR__.'/../../resources/views',
], 'sleeping_owl_shadcn');
```

`loadViewsFrom()` сам добавляет существующие application vendor roots перед
package roots. Ручной `@include` fallback, копирование файлов при build и
runtime-проверка `view()->exists()` в каждом render не нужны.

### Внешние темы

Первый этап не должен молча добавлять AdminLTE base к любой существующей
внешней теме: сегодня внешняя тема может намеренно иметь независимый полный
namespace и рассчитывать на отсутствие fallback к другой presentation.

Совместимое расширение предлагается сделать opt-in:

- существующий внешний provider продолжает регистрировать собственный
  namespace и остаётся изолированным;
- provider, желающий наследовать package default, регистрирует theme root с
  base fallback через небольшой публичный registrar/registry method;
- registrar строит hints в порядке `application -> theme -> base`;
- method не меняет `ThemeInterface::viewNamespace()` и не требует полного
  списка views;
- отсутствие view и в theme, и в base остаётся обычной диагностической ошибкой
  Laravel.

Предлагаемое имя сервиса: `ThemeViewRegistry` либо
`ThemeViewFallbackRegistrar`. Публичный API следует добавлять только вместе с
external-theme contract test и документацией; hardcoded вычисление пути
`vendor/laravelrus/sleepingowl` во внешнем package недопустимо.

## Почему сохраняем два application namespace

Сведение всех тем к `sleeping_owl::default` сделало бы каскад визуально проще,
но изменило бы существующий путь Shadcn overrides с
`resources/views/vendor/sleeping_owl_shadcn` на
`resources/views/vendor/sleeping_owl`. Это breaking change и создаёт
неоднозначность: один project override может быть корректен для AdminLTE и
ломать Shadcn.

Для удаления дублей единый namespace не требуется. Достаточно добавить один и
тот же base root последним hint для namespace конкретной темы. Возможный общий
application override для всех тем — отдельное продуктовое решение, не часть
этого рефакторинга.

## Карта изменений

### Runtime и providers

| Область | Изменение | Риск |
| --- | --- | --- |
| `src/Providers/SleepingOwlServiceProvider.php` | Base root становится единственным источником `sleeping_owl`; Shadcn получает ordered roots `theme, base` | Средний: порядок hints является контрактом |
| `src/Themes/TailwindTheme.php` | Namespace можно оставить без изменения | Низкий |
| `src/Themes/AdminLTETheme.php` и `TemplateDefault` | Публичные namespace/view methods не меняются | Низкий |
| optional `ThemeViewRegistry` | Opt-in fallback для внешних тем | Средний; лучше отдельным checkpoint |

Не рекомендуется переносить fallback в `Template::getViewPath()`: метод сейчас
возвращает строковое logical name и используется во вложенных `@include` и
`@extends`. Возврат массива candidates или `View` сломает этот контракт.

### Blade

- 136 файлов из `resources/views/themes/adminlte/default` перемещаются в
  `resources/views/default` как git renames без изменения HTML;
- 37 совпадающих Shadcn files удаляются;
- 99 отличающихся Shadcn files и 27 Shadcn components остаются на месте;
- `shared`/`features` не перемещаются;
- deeper deduplication оставшихся файлов выполняется только отдельными
  небольшими изменениями с render/browser contract, а не в этом structural
  migration.

### Tests

Три теста сейчас закрепляют неверное для новой схемы требование полного mirror:

- `TailwindThemeDisplayTest::test_every_display_and_column_view_is_owned_by_tailwind`;
- `TailwindThemeFormTest::test_every_form_view_and_form_primitive_is_owned_by_tailwind`;
- `TailwindThemeRemainingViewsTest::test_tailwind_owns_every_legacy_logical_view`.

Их нужно заменить на resolution contract:

1. Каждый base logical path находится при активной AdminLTE теме.
2. Каждый base logical path находится при активной Shadcn теме.
3. Для отличающегося файла finder возвращает Shadcn path.
4. Для не переопределённого файла finder возвращает base path.
5. Application override возвращается раньше theme и base.
6. В `themes/shadcn/default` нет файла, равного base после нормализации line
   endings и trailing whitespace.
7. Theme-only components разрешаются только из Shadcn namespace.
8. Вложенные вызовы через `AdminTemplate::getViewPath()` сохраняют выбранную
   тему и тот же каскад.

Также потребуется:

- обновить `ViewBoundaryTest`, где физический AdminLTE root сейчас является
  исполняемым контрактом;
- заменить hardcoded AdminLTE Blade paths в frontend source tests на
  `resources/views/default/...`;
- изменить assertions про `136/136 theme-owned` на `136 resolvable`, где
  физический owner может быть theme или base;
- добавить fixture Shadcn application override, чтобы явно доказать полный
  порядок `application -> theme -> base`;
- выполнить существующие render contracts обеих тем, затем полный PHP,
  frontend build/source и browser gate.

### Tailwind build

После удаления 37 Shadcn copies Tailwind content scan перестанет видеть эти
физические файлы в `themes/shadcn`. В текущем наборе это не должно удалить
нужные utilities: единственный literal Tailwind utility среди совпадающих
файлов, `mb-2`, встречается и в оставшихся Shadcn overrides. Тем не менее после
миграции необходимо сравнить production/development CSS и прогнать compiled
tests.

Не следует без измерения добавлять весь AdminLTE-compatible base root в
Tailwind scan: scanner может принять совпавшие Bootstrap class names за
Tailwind utilities и раздуть bundle. Если в будущем inherited base view будет
единственным источником нужной utility, её следует либо заменить стабильным
semantic class, либо явно добавить в Tailwind source/safelist с тестом.

### Документация

Минимально обновляются:

- `docs/modernization/view-boundaries.md`;
- `docs/modernization/tailwind-theme.md`;
- `docs/modernization/theme-customization.md`;
- `docs/modernization/upgrade-guide.md` при наличии пользовательского эффекта;
- `ADMIN_TAILWIND_THEME_PLAN.md`: исторические записи не переписывать, добавить
  новую запись, которая supersede-ит требование полного mirror.

`docs/modernization/baseline/config-inventory.json` является снимком baseline.
Его не надо механически переписывать как актуальную документацию; решение о
новом snapshot принимается отдельно по правилам baseline inventory.

## Этапы и оценка

Оценка дана для одного разработчика, знакомого с Laravel View Finder и текущими
theme tests. Она включает реализацию и проверки, но не визуальный redesign.

| Этап | Содержание | Оценка |
| --- | --- | ---: |
| 1. Contract tests | Сначала зафиксировать три уровня приоритета, inherited/overridden path и запрет одинаковых overrides | 3–5 ч |
| 2. Base move | Перенести 136 AdminLTE files в `resources/views/default`, поправить provider paths | 3–5 ч |
| 3. Shadcn pruning | Удалить подтверждённые 37 copies, проверить nested includes и direct renders | 2–4 ч |
| 4. Test migration | Переписать mirror ownership tests, обновить PHP/frontend hardcoded paths и fixtures | 5–8 ч |
| 5. Build/regression | PHP suite, frontend source/compiled tests, Tailwind bundle comparison, browser smoke | 4–7 ч |
| 6. Docs | Обновить boundaries/customization/theme plan и migration note | 2–3 ч |
| **Итого, встроенные темы** | Небьющий structural migration | **19–32 ч (примерно 2,5–4 дня)** |
| Optional external API | Registrar/registry API, scaffold, external provider tests и docs | **+6–10 ч** |

Оценка не включает объединение оставшихся 99 отличающихся Blade. Для них
нужен отдельный inventory по типу различия. Уже сейчас 40 файлов отличаются
не более чем четырьмя строками diff, чаще всего theme classes или параметрами;
часть из них потенциально можно свести к base + theme component/slot. Это
следующий рефакторинг с более высоким риском смешения presentation layers, а
не условие запуска fallback.

## Основные риски и меры

| Риск | Последствие | Мера |
| --- | --- | --- |
| Неверный порядок namespace hints | Theme перекрывает project override либо base перекрывает theme | Тестировать реальные resolved paths для всех трёх уровней |
| Скрытая зависимость от полного mirror | Direct view lookup падает после удаления файла | Итерировать все 136 base logical paths под обеими встроенными темами |
| Изменение nested include theme context | Base partial включает AdminLTE view вместо активной темы | Сохранять `AdminTemplate::getViewPath()` и добавить nested fallback test |
| Tailwind purge/content scan | Пропадает utility из готового CSS | Сравнить manifests/bundles и прогнать compiled/browser tests |
| Случайное наследование внешней темой | В DOM попадают AdminLTE classes/assets | External fallback только explicit opt-in |
| Новые дубли возвращаются | Mirror постепенно восстанавливается | Architecture test отклоняет override, совпадающий с base |
| Большой rename скрывает HTML-изменения | Сложный review и регрессия | Отдельный commit только для moves, затем provider/tests, затем pruning |

## Рекомендуемая последовательность commits

1. Tests для ordered resolution и no-identical-override guard.
2. Чистый rename `themes/adminlte/default -> default` без редактирования Blade.
3. Provider fallback `application -> shadcn -> default`.
4. Удаление 37 Shadcn copies и замена mirror assertions.
5. Обновление hardcoded paths, документации и полный regression gate.
6. Отдельно, если нужно, opt-in fallback API для внешних theme packages.

Так review видит физические перемещения отдельно от функциональных изменений,
а откат каждого слоя остаётся простым.

## Acceptance criteria

- `sleeping_owl::default.*` сохраняет прежний публичный контракт и application
  overrides AdminLTE;
- `sleeping_owl_shadcn::default.*` сохраняет текущий namespace и application
  overrides Shadcn;
- для Shadcn finder выбирает application, затем theme, затем base;
- все 136 base logical paths доступны обеим встроенным темам;
- в Shadcn `default` остаются только реально отличающиеся overrides;
- одинаковый с base новый override останавливает architecture test;
- Shadcn components остаются theme-owned и не становятся частью base;
- PHP/render/frontend/browser tests проходят в обоих asset profiles;
- production/development asset manifests остаются согласованными;
- внешний theme package не получает fallback без явного opt-in;
- документация больше не требует полного mirror logical paths внутри темы.

## Приложение: первые 37 inherited views

Эти Shadcn files совпадают с AdminLTE/base после нормализации line endings и
конечного whitespace и являются кандидатами на удаление в первом проходе:

```text
_partials/asset_health.blade.php
_partials/navigation/navigation.blade.php
column/action.blade.php
column/control.blade.php
column/count.blade.php
column/custom.blade.php
column/datetime.blade.php
column/editable/boolean.blade.php
column/editable/checkbox.blade.php
column/editable/checklist.blade.php
column/editable/date.blade.php
column/editable/datetime.blade.php
column/editable/number.blade.php
column/editable/partials/controls/boolean.blade.php
column/editable/partials/controls/select.blade.php
column/editable/partials/editor.blade.php
column/editable/range.blade.php
column/editable/select.blade.php
column/editable/text.blade.php
column/editable/textarea.blade.php
column/email.blade.php
column/header.blade.php
column/link.blade.php
column/text.blade.php
column/tree_control.blade.php
column/url.blade.php
display/extensions/actions_form.blade.php
display/extensions/columns_filters_table.blade.php
display/extensions/links.blade.php
form/card/buttons.blade.php
form/card/element.blade.php
form/element/daterange.blade.php
form/element/formelements.blade.php
form/element/hidden.blade.php
form/element/related/elements_without_card.blade.php
helper/autoupdate.blade.php
helper/ckeditor/ckeditor_upload_file.blade.php
```

Перед фактическим удалением список следует пересчитать в том же commit, чтобы
не удалить файл, который успел получить theme-specific изменение.
