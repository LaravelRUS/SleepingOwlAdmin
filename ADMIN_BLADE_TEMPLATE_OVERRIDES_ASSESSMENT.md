# Оценка перехода Blade на default + theme/application overrides

## Статус реализации

Встроенный scope выполнен 2026-09-09:

- 136 AdminLTE-compatible views перенесены без изменения содержимого в
  `resources/views/default` (`337f3184`);
- Shadcn зарегистрирован с ordered roots `theme, base`, при этом прежние
  application namespaces сохранены;
- заново пересчитаны и удалены ровно 37 одинаковых Shadcn copies
  (`14cccdce`);
- оставшиеся 99 overrides классифицированы по реальной причине различия.
  Semantic `soa-*` hooks перенесены в общий base рядом с сохранёнными
  Bootstrap/AdminLTE compatibility classes; после этого удалены ещё 98
  presentation-only overrides;
- в `resources/views/themes/shadcn/default` оставлен только один реальный
  override `_layout/inner`: темы действительно по-разному компонуют shell,
  page heading и footer. Navigation, table и login сведены в общий markup;
- 27 Shadcn component prototypes без runtime ownership перенесены в
  `resources/archive/unused-sources`; активный namespace их не разрешает;
- после первого переноса tests проверяли все 136 logical paths для обеих тем;
  follow-up consolidation оставил 103 канонических theme-owned paths, три
  уровня приоритета, nested theme context, отсутствие одинаковых/пустых views
  и отсутствие неявного fallback у внешней темы;
- оба asset profiles пересобраны. Tailwind utilities больше не зависят от
  случайных class names в theme Blade и содержат только явно закреплённые
  `flex`/`grid`; production/development utility CSS занимает 122/202 bytes;
- browser fixtures переведены с удалённых per-feature paths на фактические
  `shared/features` и theme bundles. Заодно legacy AdminLTE CSS перенесён перед
  feature adapters внутри общего theme entry, чтобы adapters сохраняли
  приоритет после укрупнения. Полная Playwright matrix: 141/141.
- после финального объединения Blade оба asset profiles повторно пересобраны.
  Итоговые gates: PHPUnit 635 tests / 3286 assertions (11 skipped), Vitest
  115 files / 496 tests, Playwright 141/141, ESLint и Stylelint без ошибок.

Follow-up после разрешения breaking paths укрупнил не только theme mirrors, но
и сам base: 35 файлов без самостоятельного markup ownership перенесены в
`resources/archive/unused-sources`. Восемь bridge views заменены прямыми
`shared.*`/`features.*` ссылками; control/card/message/scalar/editor variants
теперь передают classes и configuration из PHP в один реальный owner template.
Пустой daterange placeholder также архивирован. В активном runtime осталось
103 base views + один Shadcn override + 10 shared/feature views = 114 Blade.

Optional публичный fallback registrar для внешних theme packages не добавлен:
assessment определяет его как отдельный opt-in scope, а текущий внешний
contract намеренно остаётся изолированным.

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

## Исходная инвентаризация (до реализации)

До перехода оба каталога содержали одинаковый набор из 136 логических путей:

```text
resources/views/themes/adminlte/default  136 Blade, 2719 строк
resources/views/themes/shadcn/default    136 Blade, 2713 строк
```

Сравнение выполнено по одинаковым relative paths. После игнорирования CRLF/LF,
форматирующего whitespace и пустых строк без Blade/HTML-содержимого:

- 37 файлов функционально одинаковы и могут наследоваться из base;
- 99 файлов содержали различия, требовавшие дальнейшей классификации;
- уникальных logical paths только в одной теме сейчас нет;
- после первого этапа два `default`-дерева уменьшаются с 272 до 235 файлов:
  136 base + 99 overrides;
- удаляется 37 файлов и около 318 строк из Shadcn mirror, то есть 13,6% файлов
  двух текущих `default`-деревьев;
- 27 файлов `resources/views/themes/shadcn/components` первоначально считались
  theme-owned primitives и не входили в первый проход дедупликации.

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

Первый проход сознательно удалял только byte-equivalent copies. Второй проход
показал, что 98 из 99 различий были presentation-only: классы, props с
классами либо небольшие общие accessibility improvements. Они объединены не
механическим копированием, а единым контрактом `legacy classes + soa-*`.
Единственный файл с реальной разницей композиции shell остался override.

Итоговый runtime inventory первого theme-deduplication этапа:

| Группа | Base paths | Наследуются Shadcn | Shadcn overrides |
| --- | ---: | ---: | ---: |
| `_layout` | 2 | 1 | 1 |
| `_partials` | 15 | 15 | 0 |
| `column` | 53 | 53 | 0 |
| `dashboard.blade.php` | 1 | 1 | 0 |
| `display` | 15 | 15 | 0 |
| `form` | 46 | 46 | 0 |
| `helper` | 3 | 3 | 0 |
| `pages` | 1 | 1 | 0 |
| **Итого** | **136** | **135** | **1** |

После follow-up consolidation канонический theme inventory стал таким:

| Группа | Base paths | Наследуются Shadcn | Shadcn overrides |
| --- | ---: | ---: | ---: |
| `_layout` | 2 | 1 | 1 |
| `_partials` | 12 | 12 | 0 |
| `column` + `display` | 46 | 46 | 0 |
| `form` | 40 | 40 | 0 |
| dashboard/helper/pages | 3 | 3 | 0 |
| **Итого** | **103** | **102** | **1** |

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
        └── default/                 # только 1 shell-composition override

resources/archive/unused-sources/
└── resources/views/themes/shadcn/components/  # 27 reference prototypes
```

Отдельный `resources/views/themes/adminlte/default` после переноса не нужен:
base и есть совместимая AdminLTE presentation. Пустой каталог или marker-файл
оставлять не следует. Если позднее у AdminLTE появится вариант, отличный от
base contract, для него можно зарегистрировать такой же override root.

`shared` и `features` не надо сливать в `default`: у них уже есть отдельная
граница ownership. После разрешения breaking paths однострочные compatibility
bridges удалены, а их consumers используют canonical `shared.*`/`features.*`
paths напрямую; создавать такие bridges снова не следует.

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

- 136 файлов из `resources/views/themes/adminlte/default` перемещены в
  `resources/views/default`;
- 37 совпадающих Shadcn files удалены первым structural checkpoint;
- 98 presentation-only overrides сведены в общий markup отдельными слоями:
  columns, display, basic forms, rich forms, layout/partials;
- единственный shell-composition override оставлен в теме;
- 27 component prototypes перенесены в archive после проверки отсутствия
  runtime references;
- `shared`/`features` не перемещались: их ownership уже был корректным.

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
7. Архивные component prototypes не разрешаются ни из Shadcn, ни из base
   namespace.
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

После удаления presentation-only Shadcn copies Tailwind content scan видит
только один физический override. Нужный theme contract теперь задаётся
стабильными `soa-*` selectors в Sass, а не случайным обнаружением utility names
в дублирующихся Blade. Production/development CSS необходимо пересобирать и
проверять как prepared artifacts.

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

Последующая классификация 99 Blade выполнена отдельными checkpoint-коммитами.
Она не вводит PHP class registry, slot abstraction или conditional theme
branches: base хранит один markup с двумя совместимыми наборами классов, а
override существует только при реальной DOM/behavior разнице.

## Основные риски и меры

| Риск | Последствие | Мера |
| --- | --- | --- |
| Неверный порядок namespace hints | Theme перекрывает project override либо base перекрывает theme | Тестировать реальные resolved paths для всех трёх уровней |
| Скрытая зависимость от полного mirror | Direct view lookup падает после удаления файла | Итерировать все 103 canonical base logical paths под обеими встроенными темами |
| Изменение nested include theme context | Base partial включает AdminLTE view вместо активной темы | Сохранять `AdminTemplate::getViewPath()` и добавить nested fallback test |
| Tailwind purge/content scan | Пропадает utility из готового CSS | Сравнить manifests/bundles и прогнать compiled/browser tests |
| Случайное наследование внешней темой | В DOM попадают AdminLTE classes/assets | External fallback только explicit opt-in |
| Новые дубли возвращаются | Mirror постепенно восстанавливается | Architecture test отклоняет override, совпадающий с base |
| Большой rename скрывает HTML-изменения | Сложный review и регрессия | Отдельный commit только для moves, затем provider/tests, затем pruning |

## Выполненная последовательность commits

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
- все 103 канонических base logical paths доступны обеим встроенным темам;
- в Shadcn `default` остаются только реально отличающиеся overrides;
- одинаковый с base новый override останавливает architecture test;
- архивные Shadcn component prototypes не являются runtime views;
- PHP/render/frontend/browser tests проходят в обоих asset profiles;
- production/development asset manifests остаются согласованными;
- внешний theme package не получает fallback без явного opt-in;
- документация больше не требует полного mirror logical paths внутри темы.

## Приложение: первые 37 inherited views (исторический список)

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

Список был пересчитан непосредственно перед удалением в `14cccdce`; все эти
пути теперь разрешаются из `resources/views/default`.
