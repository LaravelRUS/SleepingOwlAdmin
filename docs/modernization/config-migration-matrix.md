# Config migration matrix

Machine-readable source: `docs/modernization/config-migration-matrix.json`.

Базовое правило: существующий ключ сохраняется, пока отдельное проверенное решение не докажет необходимость deprecation/removal. Полная повторная публикация пользовательского `config/sleeping_owl.php` не требуется.

## Статусы текущего package config

| Статус | Группа | Контракт |
| --- | --- | --- |
| `unchanged` | backend/core keys | Сохраняются имя, тип default и backend behavior. `bootstrapDirectory` по-прежнему означает каталог `app/Admin`. |
| `unchanged` | aliases, кроме assets/meta | Классы из пользовательского config регистрируются напрямую; тема их не преобразует. |
| `unchanged` | `wysiwyg.*`, `wysiwyg_cdn.*` | Сохраняются до отдельного editor audit, включая сейчас неиспользуемые CDN settings. |
| `same key/new implementation` | DataTables/state/auto-update | PHP/config API остаётся, реализация переезжает на DataTables 2 и native modules. Raw vendor options получают отдельную migration table. |
| `same key/new implementation` | `dev_assets` | Существующий `ADMIN_DEV_ASSETS` выбирает готовый production/development manifest profile целиком. |
| `same key/new implementation` | date/time, uploads, lazy images, scroll helpers | Пользовательский contract сохраняется, jQuery/Vue 2 integrations заменяются feature drivers/Vue 3 islands/native APIs. |
| `same key/new implementation` | `template` | Тот же ключ выбирает AdminLTE, Tailwind или custom `ThemeInterface`; legacy `TemplateDefault` получает adapter. |
| `same key/new implementation` | aliases `Assets`, `Meta`, `PackageManager` | Legacy KodiCMS class strings нормализуются на first-party facades после удаления Composer package. |
| `theme-owned` | layout/logo/footer/card/mode keys | Ключи сохраняются и без преобразования передаются выбранной теме. Пользователь задаёт classes выбранной темы напрямую. |

В текущих 113 именованных paths нет ключей со статусом `removed`; это сознательное следствие compatibility-first policy.

## Legacy и неявные keys

| Ключ | Статус | Решение |
| --- | --- | --- |
| `show_editor` | `deprecated` | Если `enable_editor` отсутствует, использовать старое значение и выдавать deprecation; replacement — `enable_editor`. Найден в read-only Laluna config. |
| `policies_namespace` | `unchanged` | Добавить существующий runtime default в package config; старые configs продолжают работать без ключа. |

## Новый ключ

| Ключ | Owner | Default | Решение |
| --- | --- | --- | --- |
| `sidebar_background_color` | theme | `null` | После валидации задаёт `--soa-sidebar-bg`; `null` возвращает default выбранной темы. |

## Проверка покрытия

Команда `npm run baseline:config:validate` сравнивает matrix с baseline inventory. Каждый текущий named config path обязан попасть ровно в одно правило и иметь один из утверждённых migration statuses.
