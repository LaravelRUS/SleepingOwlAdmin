# Theme metadata contract

## Назначение

`ThemeInterface` описывает только выбранную presentation implementation: стабильный id, Blade namespace, логические assets, icon tokens и поддерживаемые capabilities. Он не получает методы для CSS-классов, не преобразует пользовательские HTML attributes и не управляет lifecycle feature drivers.

Авторы тем возвращают простые массивы. Core преобразует их в небольшие проверяемые value objects:

- `ThemeAssetManifest` — логические entries темы и её feature adapters;
- `ThemeCapabilities` — типизированный набор стандартных presentation capabilities;
- `ThemeIcons` — theme-owned icon tokens.

Это сохраняет простую реализацию custom theme и не переносит manifest parsing, capability checks или icon lookup в `TemplateInterface`.

## Логический asset manifest

Theme manifest fragment не содержит filenames, URLs, hashes или build profile. Допустимы только два вида entries:

```text
theme:<theme-id>
feature:<feature-id>:theme:<theme-id>
```

Например:

```php
public function assets(): array
{
    return [
        'theme:acme',
        'feature:table:theme:acme',
        'feature:tabs:theme:acme',
    ];
}
```

`ThemeAssetManifest::fromTheme($theme)` проверяет ownership каждого entry, запрещает физические пути и дубликаты и всегда возвращает base theme entry первым. `entriesFor($activeFeatures)` добавляет только объявленные adapters фактически активных features, сохраняя порядок запрошенных features и не загружая остальные chunks.

Пустой список временно разрешён для legacy template adapter. Встроенные и новые custom themes должны объявлять `theme:<id>`. Runtime `AssetManifestResolver` сопоставляет ids с versioned filenames и checksums выбранного профиля; theme contract сам файловую систему не читает. Полная schema описана в `asset-manifest.md`.

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
| `table-presentation` | table wrapper, responsive presentation и styles для table driver |

`ThemeCapabilities::fromTheme($theme)` отклоняет неизвестные значения и предоставляет типизированный `supports(ThemeCapability $capability)`. Отсутствующая capability не включает AdminLTE fallback и не даёт core права добавить Bootstrap/Tailwind classes. Компонент или будущий coordinator должен либо выбрать поддерживаемое theme-owned представление, либо выдать явную диагностическую ошибку.

Capability говорит только о presentation support. Он не означает, что тема владеет query, transport, state или lifecycle tabs/DataTables/modal. Эта логика остаётся в core либо соответствующем feature driver.

## Icon tokens

`icons()` возвращает пары `logical-name => theme-token`. Token является непрозрачным значением для theme-owned Blade view: например именем SVG symbol, именем icon partial или локальным class token. Core не выводит token как raw HTML и не применяет его как CSS-класс пользовательского компонента.

`ThemeIcons::fromTheme($theme)` проверяет логические имена и непустые строковые tokens, затем предоставляет `has()`, `get()` и `all()`. Отсутствующий icon возвращает `null`; решение показать текст, скрыть необязательный icon или сообщить об ошибке принимает вызывающий theme component, без неявного обращения к другой теме.

## Legacy AdminLTE metadata

Текущая extracted legacy theme объявляет логический entry `theme:legacy-adminlte` и все семь capabilities, которые уже присутствуют в её Bootstrap/AdminLTE presentation. До контролируемого переключения coordinator/registry фактическую регистрацию старых файлов продолжает выполнять `TemplateDefault`; наличие resolver не меняет legacy runtime asset URLs и не смешивает переходный adapter с незавершёнными modern bundles.

## Выбор темы и config values

Существующий `sleeping_owl.template` остаётся единственным selector key. Значением является class-string одной из двух форм:

- legacy implementation `TemplateInterface` — продолжает работать как `sleeping_owl.template` и получает `LegacyTemplateThemeAdapter`;
- новая implementation `ThemeInterface` — становится выбранной темой и получает внутренний `ThemeTemplateAdapter` для переходных вызовов старого rendering API.

Класс, не реализующий ни один contract, вызывает `TemplateException`; неявного fallback к AdminLTE нет. Реализация обоих interfaces может использоваться напрямую с обеих сторон selection boundary.

`ThemeConfiguration` передаёт выбранной теме только зафиксированные theme-owned keys под исходными именами. Значения не приводятся к строкам, не переименовываются и не преобразуются в semantic classes. В каждый view, созданный через transitional template renderer, передаются зарезервированные переменные `$theme` и `$themeConfig` вместе с прежним `$template`.

В набор входят 14 существующих keys из config migration matrix и `sidebar_background_color`. Старый опубликованный config может не содержать новый ключ: в этом случае package default `null` не выводит override, и theme default применяется без пересборки assets.

Runtime theme colors не передаются как произвольный CSS. `ThemeCssVariables` отображает allowlisted config keys в публичные `--soa-*`, а `CssColor` проверяет значение до render. Общий view `sleeping_owl::shared.theme.runtime_properties` должен находиться в `<head>` после подключённых stylesheets; AdminLTE layout уже выполняет этот contract. Полный перечень и правила custom theme описаны в `runtime-theme-properties.md`.
