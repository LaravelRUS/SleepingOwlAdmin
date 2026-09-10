# Config migration matrix

Machine-readable source: `docs/modernization/config-migration-matrix.json`.

Базовое правило: существующий ключ сохраняется, пока отдельное проверенное решение не докажет необходимость deprecation/removal. Полная повторная публикация пользовательского `config/sleeping_owl.php` не требуется.

## Статусы текущего package config

| Статус                        | Группа                                          | Контракт                                                                                                                                                                                |
| ----------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `unchanged`                   | backend/core keys                               | Сохраняются имя, тип default и backend behavior. `bootstrapDirectory` по-прежнему означает каталог `app/Admin`, а `policies_namespace` — namespace для автоматически найденных policy.    |
| `unchanged`                   | aliases, кроме assets/meta                      | Классы из пользовательского config регистрируются напрямую; тема их не преобразует.                                                                                                     |
| `unchanged`                   | `wysiwyg.*`, включая `wysiwyg.cdn.*`            | Сохраняются до отдельного editor audit, включая сейчас неиспользуемые CDN settings.                                                                                                     |
| `same key/new implementation` | `datatables`, `datatables_settings.*`           | PHP/config API остаётся, реализация работает через `data-table-engine` на DataTables 3 и native modules. Raw vendor options описаны в [`data-table-options.md`](data-table-options.md). |
| `same key/new implementation` | `dev_assets`                                    | Существующий `ADMIN_DEV_ASSETS` выбирает готовый production/development manifest profile целиком.                                                                                       |
| `same key/new implementation` | date/time, uploads, lazy images, scroll helpers | Вложенные `files.*`, `images.*` и `ui.scroll_to_*` сохраняют пользовательский contract; jQuery/Vue 2 integrations заменяются feature drivers/Vue 3 islands/native APIs.                 |
| `same key/new implementation` | `template.*`                                    | `template.default` + `template.themes` выбирает `adminlte`, `empty`, `tabler` или внешнюю готовую тему по имени; смена темы использует готовые assets без Node.js/rebuild. Прежний class-string остаётся runtime fallback, `TemplateDefault` получает adapter, внешний provider может зарегистрировать fragment через `ThemeRegistry`. |
| `same key/new implementation` | aliases `Assets`, `Meta`, `PackageManager`      | Legacy KodiCMS class strings нормализуются на first-party facades после удаления Composer package.                                                                                      |
| `removed`                      | aliases `Form`, `HTML`, `A`                     | `spatie/laravel-html` удалён; views используют native Blade markup и first-party `HtmlAttributeBag`. Прямые application usages обновляются вместе с major-версией.                       |
| `theme-owned`                 | `ui.*`, кроме `ui.scroll_to_*`                  | Ключи сохраняются и без преобразования передаются выбранной теме. Пользователь задаёт classes выбранной темы напрямую.                                                                  |

Текущий inventory содержит 114 именованных paths. Все они покрыты ровно одним
правилом migration matrix; динамически читаемые `ui.*` и обращения frontend к
`Admin.Config` также включены в инвентарь. Ключи ENV editor и `show_editor` имеют
статус `removed`: пакет больше не читает их и не предоставляет fallback.
`sidebar_background_color` остаётся отдельным optional key с default `null`.

## Legacy и неявные keys

| Ключ                 | Статус       | Причина / replacement / fallback / timeline                                                                                                                                                                                                                                                                         |
| -------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `show_editor` и ENV editor keys | `removed` | Самописный ENV editor удалён вместе с маршрутами, виджетом и записью `.env`. Удалите `show_editor`, `enable_editor`, `env_editor_*`, `env_keys_readonly`, `env_can_add` и `env_can_delete` из опубликованного config. Если нужен UI, подключите [`geosot/laravel-env-editor`](https://github.com/GeoSot/Laravel-EnvEditor) непосредственно в приложении. |
| `aliases.A`, `aliases.Form`, `aliases.HTML` | `removed` | Алиасы принадлежали удалённому `spatie/laravel-html`. Используйте native Blade и `SleepingOwl\Admin\Support\HtmlAttributeBag`; runtime fallback отсутствует. |
| `search_operator` | `removed` | Переименован в `postgres_search_operator`, поскольку настройка применяется только к PostgreSQL. Runtime fallback отсутствует: обновите опубликованный config. |

## Новый ключ

| Ключ                       | Owner | Default | Решение                                                                              |
| -------------------------- | ----- | ------- | ------------------------------------------------------------------------------------ |
| `sidebar_background_color` | theme | `null`  | После валидации задаёт `--soa-sidebar-bg`; `null` возвращает default выбранной темы. |

## Проверка покрытия

Команда `npm run baseline:config:validate` сравнивает matrix с inventory. Каждый текущий named config path обязан попасть ровно в одно правило и иметь один из утверждённых migration statuses.
