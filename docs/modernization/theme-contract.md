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

Пустой список временно разрешён для legacy template adapter. Встроенные и новые custom themes должны объявлять `theme:<id>`. Позднее runtime manifest resolver сопоставит эти ids с production/development entries, versioned filenames и checksums; theme contract сам файловую систему не читает.

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

Текущая extracted legacy theme объявляет логический entry `theme:legacy-adminlte` и все семь capabilities, которые уже присутствуют в её Bootstrap/AdminLTE presentation. До появления versioned resolver фактическую регистрацию старых файлов продолжает выполнять `TemplateDefault`; декларация manifest не меняет runtime asset URLs и не смешивает переходный adapter с будущим resolver.
