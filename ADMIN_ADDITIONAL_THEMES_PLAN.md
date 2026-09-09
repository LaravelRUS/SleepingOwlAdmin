# План добавления последующих тем SleepingOwlAdmin

## Назначение и текущий статус

Этот файл — повторяемый acceptance checklist для каждой новой встроенной или внешней темы. Он не является планом реализации конкретного UI framework: после утверждения темы создаётся отдельный `ADMIN_<THEME>_THEME_PLAN.md` с design brief, dependency/license inventory, структурой файлов и журналом выполнения. Все незакрытые пункты ниже проверяются заново для каждой продуктовой темы.

Текущее состояние:

- `adminlte` и `shadcn` — поставляемые встроенные темы; план Tailwind/Shadcn завершён в [`ADMIN_TAILWIND_THEME_PLAN.md`](ADMIN_TAILWIND_THEME_PLAN.md);
- framework-free theme остаётся только test fixture публичного контракта и не является продуктовой темой;
- Tabler выбран как основа следующей планируемой встроенной темы, но `TablerTheme` ещё не реализована и не зарегистрирована; её работа ведётся в [`ADMIN_TABLER_THEME_PLAN.md`](ADMIN_TABLER_THEME_PLAN.md);
- общий structural layer `shared:ui` развивается отдельно по [`ADMIN_SHARED_UI_STYLES_PLAN.md`](ADMIN_SHARED_UI_STYLES_PLAN.md);
- общий release checklist остаётся в [`ADMIN_UI_MODERNIZATION_PLAN.md`](ADMIN_UI_MODERNIZATION_PLAN.md).

Источники истины для действующего контракта: [`theme-contract.md`](docs/modernization/theme-contract.md), [`theme-customization.md`](docs/modernization/theme-customization.md), [`asset-manifest.md`](docs/modernization/asset-manifest.md) и [`runtime-theme-properties.md`](docs/modernization/runtime-theme-properties.md). При расхождении этот reusable checklist корректируется по коду и executable tests, а не сохраняет старую схему ради истории.

## Уже готовая платформенная основа

Эти пункты не нужно реализовывать заново в каждой теме, но их отсутствие или изменение блокирует её release:

- [x] `sleeping_owl.template.default` выбирает canonical lower-kebab name из `sleeping_owl.template.themes`; прежний class-string поддерживается только как migration fallback.
- [x] Canonical name хранится в config/registry и `ThemeSelection`; `ThemeInterface` больше не содержит и не должен дублировать `id()`.
- [x] `ThemeRuntimeAssets` автоматически добавляет `core`, `shared:ui`, `shared:features` и обязательный `theme:<name>` в детерминированном порядке.
- [x] Ошибочная config map, неизвестный class/capability, конфликт registry name и несовместимый manifest завершаются диагностической ошибкой без fallback к другой теме.
- [x] Внешний self-contained package регистрируется через `ThemeRegistry::registerPackage()`; повторная регистрация canonical name отклоняется, а не заменяет прежнюю тему.
- [x] `php artisan sleepingowl:extension:make theme <Name>` создаёт поддерживаемый стартовый каркас с class/provider, Laravel-layout sources/views, двумя готовыми profiles и manifest с MD5/SHA-256.

## Gate перед началом темы

- [ ] Согласованы canonical name, аудитория, single job админ-интерфейса, визуальное направление и отличия от уже поставляемых тем.
- [ ] Выбран framework/template либо подтверждена framework-free реализация.
- [ ] Зафиксированы exact upstream/package versions, source URL, лицензии, способ обновления и право распространять готовые assets/fonts/icons.
- [ ] Выбран один путь поставки: встроенная тема основного Composer package или самостоятельный Composer package с service provider.
- [ ] Составлены component/capability inventory и список необходимых vendor runtimes; подтверждено, что PHP DSL, transport, state, query и lifecycle feature drivers не меняются ради presentation.
- [ ] Создан отдельный implementation plan с checkpoint-ами, test matrix и критериями release.

## Путь интеграции

### Встроенная тема

- [ ] Theme class напрямую реализует `ThemeInterface`, а canonical name добавлен ключом в `sleeping_owl.template.themes`; отдельная регистрация через `ThemeRegistry` не требуется.
- [ ] Sources размещены по действующей Laravel resource layout в `resources/css`, `resources/js` и `resources/views`; output добавлен в оба package asset profiles.
- [ ] Изменения общего `core`, `shared:ui` или `shared:features` вынесены в отдельное platform-решение и проверены на всех встроенных темах.

### Внешняя Composer theme

- [ ] Package является self-contained unit: `<root>/asset-manifest.json`, `resources/{css,js,views}` и готовые `public/profiles/{production,development}`.
- [ ] Provider использует `afterResolving(ThemeRegistry::class, ...)`, вызывает `registerPackage(<name>, <class>, <root>, <public-url-root>)`, отдельно регистрирует Blade namespace и публикует только готовый `public`.
- [ ] Registry name не дублируется методом theme class и не обязан повторяться в application `template.themes`: выбранный `template.default` может быть разрешён registry.
- [ ] Fragment не содержит `core` и package-owned feature drivers; declared entries, оба profiles, relative public paths, versions и checksums проходят `ExternalThemeAssets` validation.
- [ ] Документирована отдельная команда/tag публикации assets внешнего package. `sleepingowl:update` не компилирует, не копирует и не проверяет файлы внешней темы.

## Публичный PHP contract

- [ ] Theme class реализует ровно актуальные методы `ThemeInterface`: `viewNamespace()`, `assets()`, `icons()` и `capabilities()`.
- [ ] `assets()` содержит только unscoped declarations `shared:<id>`, `feature:<feature>` и optional `theme:overrides`; filenames, URLs, hashes, profiles, canonical name и уже scoped ids в него не попадают.
- [ ] Пустой `assets()` допустим: runtime всё равно создаёт `theme:<name>`. Отдельный `feature:<feature>` объявляется только для действительно независимо поставляемого adapter chunk; встроенные adapters могут входить в основной theme bundle.
- [ ] `icons()` возвращает только проверяемые logical token pairs, а `capabilities()` — подмножество `tabs`, `tooltip`, `dropdown`, `modal`, `notification`, `icons`, `sidebar`, `table-presentation`.
- [ ] Неизвестные/дублирующиеся declarations и несовпадение class, registry name или manifest завершаются явной ошибкой без fallback.

## Views, config и presentation

- [ ] Сохранены публичные logical view paths. Встроенная тема переиспользует canonical base markup и хранит только реальные presentation overrides; внешний namespace поставляет полный contract либо явно настраивает собственное наследование — автоматического fallback на built-in views нет.
- [ ] Application/vendor overrides имеют первый приоритет и работают без пересборки package/theme assets.
- [ ] Concrete framework classes и допустимая вложенность принадлежат Blade/theme data; PHP не переводит semantic variants через class resolver.
- [ ] Общие `soa-*`, documented `data-*`, ARIA и field-name behavior hooks сохранены. Feature JavaScript не привязывается к presentation classes.
- [ ] Vue islands получают конечные classes/options через Blade props и используют общий precompiled Vue/runtime contract без импорта theme framework.
- [ ] Пользовательские attributes/classes и hook-compatible изменения вложенности доходят до browser без потерь.
- [ ] Layout включает `sleeping_owl::shared.theme.runtime_properties` в `<head>` после stylesheets и получает `$theme`, `$themeName`, `$themeConfig` и нейтральный `$assetHealthStatus` через действующий rendering boundary.
- [ ] При asset version mismatch тема показывает локализованный status и точную команду `php artisan sleepingowl:update`, даже если обычный footer скрыт; при match лишняя разметка отсутствует.
- [ ] При capability `sidebar` валидированный `sidebar_background_color` применяется через `--soa-sidebar-bg`; остальные runtime-настройки используют только документированный `ThemeConfiguration`/`--soa-*` surface.

## Assets и styles

- [ ] Тема владеет собственными source/build entries и не импортирует AdminLTE/Shadcn/другую тему. Package-owned `shared:*` dependencies используются через logical declarations, а не копируются.
- [ ] `shared:ui` и `shared:features` не перечисляются как theme-owned bundles и не компилируются повторно: runtime подключает их автоматически для любой выбранной темы.
- [ ] У каждого CSS/JS правила один owner: `core`, `shared`, `theme` или optional `theme override`. Имена Sass partials не являются контрактом; literals/defaults/tokens находятся у фактического owner, generated CSS отделён от handwritten sources.
- [ ] Theme entry задаёт собственные defaults для поддерживаемых `--soa-*`; dark mode меняет значения properties под `:root[data-color-scheme='dark']`, а не дублирует component rules.
- [ ] Optional `theme:overrides` используется только для небольшого correction layer и загружается после theme/adapters; application CSS остаётся последним consumer-owned слоем.
- [ ] CSS order подтверждён как `core → shared:ui → shared:features → selected theme → declared feature adapters → theme overrides → application CSS`; JS сохраняет общий runtime/feature/module order.
- [ ] Production и development profiles содержат одинаковые logical ids в одинаковом порядке. Каждый manifest-referenced JS/CSS/static file существует и имеет корректные version/checksum metadata; source maps учитываются, только если тема их поставляет.
- [ ] Icons находятся в явно объявленном shared либо theme-owned entry без дублирования, а bundle не содержит незаявленных framework/runtime dependencies.
- [ ] Consumer устанавливает, публикует и выбирает готовую тему без Node.js/npm; frontend toolchain нужен только её автору.

## Capabilities и feature adapters

- [ ] Для каждой объявленной capability существует theme-owned presentation или явно документирован native/classless mode.
- [ ] Theme/adapters не копируют package-owned transport, state, query, lifecycle и общий `shared:features` runtime.
- [ ] Vendor-owned DOM настраивается через публичные vendor options и theme-owned styles; лишний aggregate vendor runtime не поставляется.
- [ ] Notification/tree adapters слушают публичные native events и не монтируют feature повторно.
- [ ] Independently shipped adapter объявлен одновременно в `assets()` и manifest; неподдерживаемая capability не включает adapter или presentation другой темы и не вызывает fallback.

## Изоляция и release acceptance

- [ ] При выборе темы загружаются общие platform layers, ровно один `theme:<name>`, только её declared adapters и optional override; bundles/overrides других тем отсутствуют в response URLs.
- [ ] Theme bundle не содержит Bootstrap/AdminLTE/Tailwind/другой framework, если он не является зафиксированной dependency этой темы.
- [ ] Core/shared sources остаются неизменными при чисто theme-owned работе. Если общий слой всё же изменён, это явно отражено в platform plan и повторно проверено на AdminLTE, Shadcn и framework-free fixture.
- [ ] Общие PHP/render/browser contracts проходят на одном display/form fixture в AdminLTE, Shadcn и новой теме в production/development profiles.
- [ ] Полная functional matrix покрывает заявленные capabilities, tables/actions/forms/uploads/tree/lightbox/WYSIWYG/Vue islands и application Blade/CSS/JS overrides.
- [ ] Accessibility/visual smoke покрывает keyboard, focus, ARIA, contrast, reduced motion, responsive layout и light/dark states.
- [ ] Asset match/mismatch, missing/corrupt manifest, locale fallback и отсутствие warning-разметки при совпадающей версии покрыты tests.
- [ ] Bundle size, dependency/license inventory, config matrix, setup/customisation guide, migration notes и CHANGELOG обновлены.
- [ ] Для встроенной темы clean Composer install проходит `sleepingowl:update` и `sleepingowl:update --check` без Node.js. Для внешней темы отдельно проверены Composer discovery, её publish tag, registry selection и реальные опубликованные URLs.

Для промежуточных checkpoint-ов запускаются узкие PHPUnit/Vitest/browser tests и lint/format только затронутых owners. `npm run production` выполняется при изменении frontend sources или manifest output. Финальный gate конкретной темы включает полный `vendor/bin/phpunit`, `npm run check`, `npm run test:e2e` и соответствующий clean-install smoke.

## Журнал

| Дата | Решение | Результат |
| --- | --- | --- |
| 2026-09-07 | Разделение планов | Создан reusable checklist; каждая продуктовая тема получает отдельный implementation plan. |
| 2026-09-08 | Framework-free acceptance fixture | Test-only тема подтвердила публичные PHP/Blade/assets/browser contracts без UI framework; fixture не стала продуктовой темой. |
| 2026-09-08 | Tailwind/Shadcn и Tabler | TailwindTheme завершена как встроенная `shadcn`; официальный Tabler выбран для отдельного будущего плана, но ещё не поставляется. |
| 2026-09-09 | Canonical theme name | `ThemeInterface::id()` удалён. Имя темы хранится ключом named config/registry, а runtime сам формирует scoped logical ids. |
| 2026-09-09 | Shared layers и внешний package contract | `shared:ui`/`shared:features` подключаются автоматически; `registerPackage()` и theme scaffold закрепили self-contained no-build flow, два готовых profiles и явный отказ при конфликте имён. |
| 2026-09-09 | Актуализация checklist | Удалены устаревшие class-string/id/replacement assumptions, старый жёсткий Sass layout и обещание публиковать внешние themes через `sleepingowl:update`; встроенный и внешний release paths разделены. |
