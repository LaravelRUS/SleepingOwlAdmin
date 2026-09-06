# Versioned asset manifest

## Назначение

`public/default/asset-manifest.json` является runtime-картой готовых frontend bundles. PHP-код, Blade views и расширения используют только logical ids и не строят физические пути, query versions или имена собранных файлов вручную.

Manifest создаётся после Laravel Mix build из `build/frontend-entries.json`. Версия пакета берётся из `Composer\InstalledVersions`, поэтому она не дублируется в config. Для каждого файла generator вычисляет MD5 content version для cache URL и SHA-256 checksum для последующей проверки publish/update workflow.

Текущие группы logical ids:

- `core`;
- общие `shared:icons` и profile-aware `shared:vue`;
- behavior entries `feature:<feature-id>`;
- presentation adapters `feature:<feature-id>:theme:<theme-id>`;
- встроенные `theme:legacy-adminlte` и `theme:tailwind`.

Table driver не содержит presentation CSS. Встроенные table adapters публикуются отдельными
feature/theme entries и загружаются только вместе с выбранной темой и активным table feature.
Фрагменты custom theme продолжают объявлять только `theme:<id>` и
`feature:<feature-id>:theme:<id>`. Они не содержат URL или filenames.

## Schema 1

```json
{
    "schema_version": 1,
    "package_version": "dev-main",
    "profiles": {
        "production": {
            "entries": {
                "core": {
                    "scripts": [
                        {
                            "file": "js/admin-core.js",
                            "version": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            "checksum": "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
                        }
                    ],
                    "styles": []
                }
            }
        }
    },
    "build_id": "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"
}
```

`file` всегда является относительным путём внутри package-owned asset root. Абсолютные URL, leading slash, backslash, `.`/`..`, неверное расширение, неизвестный logical id format, пустой bundle и несовместимая schema отклоняются до render.

Tracked manifest одновременно содержит `production` и `development` profiles с одинаковыми logical ids. `npm run production` последовательно собирает оба набора: development сохраняется несжатым с внешними source maps, production — minified без source maps. `npm run development` обновляет только development profile для локальной работы и не требует пересборки production profile.

Физические файлы находятся в `profiles/<profile>/...`; resolver никогда не объединяет их. Существующий `sleeping_owl.dev_assets`, заполняемый через `ADMIN_DEV_ASSETS`, выбирает один профиль целиком:

```env
ADMIN_DEV_ASSETS=false
```

Значение `false` выбирает `production`, `true` — `development`. Будущий Vue 3 milestone положит development runtime с warnings/devtools в те же logical entries; selector и no-build contract при этом не меняются.

## PHP responsibilities

- `ManifestAsset`, `AssetBundle`, `AssetProfile` и `AssetManifest` валидируют данные и предоставляют immutable read API;
- `AssetManifestLoader` отвечает только за filesystem/JSON boundary и преобразует любую ошибку чтения или schema в `AssetManifestException`;
- `AssetProfileSelector` преобразует только существующий config flag в `production` или `development`;
- `AssetManifestResolver` выбирает logical bundles только внутри этого профиля, сохраняет их порядок, удаляет дубликаты и строит URL через Laravel `UrlGenerator`;
- `ResolvedAssetBundle` возвращает отдельные списки scripts и styles;
- `LogicalAssetRegistrar` передаёт эти URL в first-party meta/asset registry со стабильными handles и явной цепочкой зависимостей внутри CSS и JS, не читая manifest самостоятельно.

Resolver и registrar зарегистрированы в container, но `TemplateDefault` пока продолжает загружать legacy aggregate. Переключение template на `core + selected theme + detected features` выполняется только после готовности самодостаточных browser entries, чтобы не смешать незавершённые modern entries с рабочим legacy runtime.

Если опубликованный manifest отсутствует, повреждён или не содержит запрошенный entry/profile, loader/resolver выбрасывает `AssetManifestException` с единственным штатным способом восстановления:

```bash
php artisan sleepingowl:update
```

Silent fallback на unversioned legacy path не используется.

Несовпадение `package_version` обрабатывается отдельно от повреждения. Если
manifest и опубликованные файлы структурно валидны, PHP asset health service
сравнивает manifest с Composer metadata один раз за request и позволяет
отрисовать последний целостный набор. Layout при этом показывает в footer
локализованное уведомление с точной командой
`php artisan sleepingowl:update`. При совпадении версий дополнительная
разметка не выводится.

Core передаёт теме только immutable status data и не выбирает CSS-классы.
AdminLTE и Tailwind оформляют уведомление своими Blade/Sass partials и
`--soa-*` variables; custom theme может отрисовать тот же публичный status
contract собственной разметкой. Missing/corrupt manifest, неверная schema и
checksum mismatch остаются hard errors: для них недостаточно безопасного
целостного набора, на котором можно показать обычный layout.

## No-build publish/update

Обычный пользователь не запускает npm, Mix или Vite. Оба готовых профиля входят в Composer package и публикуются стандартными командами:

```bash
php artisan sleepingowl:install
php artisan sleepingowl:update
```

Обе команды используют один `PublishAssets` installer. Он выполняет forced `vendor:publish --tag=assets`, затем `PublishedAssetVerifier` проверяет выбранный через `ADMIN_DEV_ASSETS` профиль:

- manifest читается из опубликованного `packages/sleepingowl/default`;
- `package_version` совпадает с установленной Composer-версией пакета;
- каждый JS/CSS существует;
- MD5 content version и SHA-256 checksum совпадают.

`sleepingowl:update` остаётся неинтерактивным forced publish, поэтому существующие deployment scripts продолжают обновлять уже опубликованные файлы. Повреждение или неполная публикация завершают команду ошибкой вместо запуска старых assets или frontend toolchain.
