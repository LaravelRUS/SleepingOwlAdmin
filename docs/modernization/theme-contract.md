# Theme metadata contract

## Назначение

`ThemeInterface` описывает только выбранную presentation implementation: Blade namespace, логические asset declarations, icon tokens и поддерживаемые capabilities. Canonical name хранится ключом config/registry и передаётся отдельно через `ThemeSelection`; theme class его не повторяет. Interface не получает методы для CSS-классов, не преобразует пользовательские HTML attributes и не управляет lifecycle feature drivers.

Авторы тем возвращают простые массивы. Core преобразует их в небольшие проверяемые value objects:

- `ThemeAssetManifest` — логические entries темы и её feature adapters;
- `ThemeCapabilities` — типизированный набор стандартных presentation capabilities;
- `ThemeIcons` — theme-owned icon tokens.

Это сохраняет простую реализацию custom theme и не переносит manifest parsing, capability checks или icon lookup в `TemplateInterface`.

## Логический asset manifest

`ThemeInterface::assets()` не содержит filenames, URLs, hashes, build profile или canonical theme name. Допустимы два вида declarations:

```text
shared:<shared-id>
feature:<feature-id>
theme:overrides
```

Например:

```php
public function assets(): array
{
    return [
        'shared:compatibility',
        'shared:vue',
        'feature:table',
        'feature:tabs',
    ];
}
```

`ThemeAssetManifest::fromTheme($name, $theme)` проверяет declarations, запрещает физические пути, уже scoped имена и дубликаты, затем генерирует `theme:<name>`, `feature:<feature>:theme:<name>` и optional `theme:<name>:overrides`. Он возвращает shared entries перед base theme entry и override строго последним. `entriesFor($activeFeatures)` добавляет только объявленные adapters фактически активных features, сохраняя порядок запрошенных features и не загружая остальные chunks.

Пустой список допустим и всё равно создаёт обязательный `theme:<name>` entry. Runtime `AssetManifestResolver` сопоставляет ids с versioned filenames и checksums выбранного профиля; theme contract сам файловую систему не читает. Полная schema описана в `asset-manifest.md`.

## Capability API

`ThemeCapability` задаёт закрытый набор возможностей первого major-релиза:

| Capability | Граница ответственности темы |
| --- | --- |
| `tabs` | разметка и presentation состояния tab list/panel |
| `tooltip` | доступная presentation подсказки и theme adapter |
| `dropdown` | разметка, focus presentation и theme adapter меню |
| `modal` | dialog presentation; lifecycle остаётся в отдельном driver/core service |
| `notification` | presentation success/warning/info/error messages |
| `icons` | собственная icon presentation и интерпретация объявленных tokens |
| `sidebar` | layout, navigation tree и presentation состояний open/collapsed |
| `table-presentation` | table wrapper, responsive presentation и styles для table driver |

`ThemeCapabilities::fromTheme($theme)` отклоняет неизвестные значения и предоставляет типизированный `supports(ThemeCapability $capability)`. Отсутствующая capability не включает AdminLTE fallback и не даёт core права добавить Bootstrap/Tailwind classes. Компонент или будущий coordinator должен либо выбрать поддерживаемое theme-owned представление, либо выдать явную диагностическую ошибку.

Capability говорит только о presentation support. Он не означает, что тема владеет query, transport, state или lifecycle tabs/DataTables/modal. Эта логика остаётся в core либо соответствующем feature driver.

## Icon tokens

`icons()` возвращает пары `logical-name => theme-token`. Token является непрозрачным значением для theme-owned Blade view: например именем SVG symbol, именем icon partial или локальным class token. Core не выводит token как raw HTML и не применяет его как CSS-класс пользовательского компонента.

`ThemeIcons::fromTheme($theme)` проверяет логические имена и непустые строковые tokens, затем предоставляет `has()`, `get()` и `all()`. Отсутствующий icon возвращает `null`; решение показать текст, скрыть необязательный icon или сообщить об ошибке принимает вызывающий theme component, без неявного обращения к другой теме.

## Встроенная AdminLTE theme

`AdminLTETheme` является прямой реализацией `ThemeInterface` и одновременно наследует `TemplateDefault`, пока legacy rendering API остаётся публичным. Она владеет namespace `sleeping_owl::default`, объявляет общие `shared:icons`/`shared:compatibility`/`shared:vue`/`shared:modules`, единый `theme:adminlte` и восемь capabilities. Все встроенные feature presentation adapters компилируются внутрь theme bundle, а не объявляются отдельными runtime entries. Icon classes не преобразуются в PHP: существующие Blade views и пользовательские расширения продолжают задавать нужные Font Awesome classes напрямую.

Новый package config выбирает имя `adminlte` из `template.themes`, где оно связано с `AdminLTETheme::class`. Её собственный `initialize()` регистрирует один versioned manifest profile: headless core, shared infrastructure, единый AdminLTE theme bundle и объединённый `shared:features`. `shared:modules` загружается последним, после возможных project assets, и выполняет compatibility module boot с финальным component scan. Standalone `theme:adminlte` CSS содержит Bootstrap/AdminLTE и feature presentation, но не дублирует отдельный `shared:icons` bundle.

Публичные dependency handles `admin-vue-init`, `admin-default` и `admin-modules-load` сохранены на соответствующих logical boundaries, поэтому существующие project CSS/JS продолжают подключаться без изменения API. Опубликованный config, в котором сохранён `TemplateDefault::class`, по-прежнему работает через `LegacyTemplateThemeAdapter` и старые aggregate-файлы; его lifecycle намеренно не переключён на новый runtime.

## Runtime прямой custom theme

Прямая реализация `ThemeInterface` не обязана наследовать package template или повторять его `initialize()`. Transitional `ThemeTemplateAdapter::initialize()` автоматически передаёт выбранные canonical name и тему общему `ThemeRuntimeAssets`: он регистрирует `core`, объявленные shared/theme entries, объединённый package `shared:features` и только явно объявленные external adapter chunks, scoped выбранным именем. Table adapter при наличии ставится до самозапускающегося общего runtime; остальные external adapters — после него. Объявленный `shared:modules` остаётся последним для финального module boot/scan. `AdminLTETheme` использует тот же assembler, добавляя только прежние публичные asset handles.

Таким образом, `assets()` custom theme обычно описывает лишь её shared dependencies. Base `theme:<name>` добавляется автоматически; декларация `feature:<feature>` допустима только для действительно независимо поставляемого external chunk, а не как обязательная схема для каждого компонента. Theme не перечисляет package-owned `shared:features` и не получает неявные AdminLTE, shadcn или icon assets. Отсутствующий либо повреждённый logical entry диагностируется manifest resolver; fallback к другой теме не выполняется. Готовые production/development файлы и checksums публикует автор темы, поэтому Composer-потребитель выбирает имя из `sleeping_owl.template` без Node.js и пересборки core. Внешний package регистрирует canonical name, class, manifest fragment и public root через `ThemeRegistry`; этот service-provider hook описан в [`theme-customization.md`](theme-customization.md).

Test-only `FrameworkFreeTestTheme` является executable acceptance fixture этого контракта, а не новой встроенной продуктовой темой. Она реализует только публичный interface, владеет Blade-разметкой display/form и произвольными project attributes/classes, поставляет один CSS-only Sass theme со своими dropdown/sidebar/table/tabs/tooltip adapters и не импортирует Bootstrap, AdminLTE, Tailwind или Font Awesome. Её шесть объявленных capabilities (`dropdown`, `notification`, `sidebar`, `table-presentation`, `tabs`, `tooltip`) являются проверяемым подмножеством capabilities AdminLTE; `modal` и `icons` намеренно не объявлены, icon bundle не загружается. Browser contract выполняет одинаковые операции обеих тем в production/development, проверяет отсутствие framework/global runtime и по фактическим response URLs доказывает загрузку только выбранного theme bundle.

## Выбор темы и config values

`sleeping_owl.template` остаётся единственным selector key, но новый config использует именованную карту:

```php
'template' => [
    'default' => env('SLEEPINGOWL_TEMPLATE', 'adminlte'),
    'themes' => [
        'adminlte' => SleepingOwl\Admin\Themes\AdminLTETheme::class,
        'shadcn' => SleepingOwl\Admin\Themes\TailwindTheme::class,
    ],
],
```

`template.default` выбирает ровно один ключ `template.themes`; классы остальных тем не создаются. Имена используют `lower-kebab`, неизвестное имя и некорректная карта завершаются `TemplateException` без fallback к AdminLTE.

Resolver временно принимает прежний class-string как runtime fallback, но новый package config его не публикует. После выбора класса поддерживаются две реализации:

- legacy implementation `TemplateInterface` получает `LegacyTemplateThemeAdapter`;
- новая implementation `ThemeInterface` становится выбранной темой и получает внутренний `ThemeTemplateAdapter` для переходных вызовов старого rendering API.

Класс, не реализующий ни один contract, вызывает `TemplateException`; неявного fallback к AdminLTE нет. Реализация обоих interfaces может использоваться напрямую с обеих сторон selection boundary.

`ThemeConfiguration` передаёт выбранной теме только зафиксированные theme-owned keys под canonical именами. Значения не приводятся к строкам и не преобразуются в semantic classes. В каждый view, созданный через transitional template renderer, передаются зарезервированные переменные `$theme`, `$themeName` и `$themeConfig` вместе с прежним `$template`.

В набор входят 14 существующих keys из config migration matrix и `sidebar_background_color`. Старый опубликованный config может не содержать новый ключ: в этом случае package default `null` не выводит override, и theme default применяется без пересборки assets.

Runtime theme colors не передаются как произвольный CSS. `ThemeCssVariables` отображает allowlisted config keys в публичные `--soa-*`, а `CssColor` проверяет значение до render. Общий view `sleeping_owl::shared.theme.runtime_properties` должен находиться в `<head>` после подключённых stylesheets; AdminLTE layout уже выполняет этот contract. Полный перечень и правила custom theme описаны в `runtime-theme-properties.md`.

No-build примеры выбора темы, передачи settings, подключения application CSS/JS, полного поддерживаемого списка properties и регистрации внешнего package находятся в [`theme-customization.md`](theme-customization.md).
