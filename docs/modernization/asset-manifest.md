# Versioned asset manifest

## Назначение

`public/default/asset-manifest.json` является runtime-картой готовых frontend bundles. PHP-код, Blade views и расширения используют только logical ids и не строят физические пути, query versions или имена собранных файлов вручную.

Manifest создаётся после Laravel Mix build из `build/frontend-entries.json`. Версия пакета берётся из `Composer\InstalledVersions`, поэтому она не дублируется в config. Для каждого файла generator вычисляет MD5 content version для cache URL и SHA-256 checksum для последующей проверки publish/update workflow.

Текущий набор logical ids:

- `core`;
- `feature:forms`;
- `feature:table`;
- `theme:legacy-adminlte`;
- `theme:tailwind`.

Фрагменты custom theme продолжают объявлять только `theme:<id>` и `feature:<feature-id>:theme:<id>`. Они не содержат URL или filenames.

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
- `ResolvedAssetBundle` возвращает отдельные списки scripts и styles будущему coordinator/asset registry.

Resolver зарегистрирован в container, но `TemplateDefault` пока продолжает загружать legacy aggregate. Переключение template на `core + selected theme + detected features` выполняется только после готовности обоих профилей и first-party asset registry, чтобы не смешать незавершённые modern entries с рабочим legacy runtime.

Если опубликованный manifest отсутствует, повреждён или не содержит запрошенный entry/profile, loader/resolver выбрасывает `AssetManifestException` с единственным штатным способом восстановления:

```bash
php artisan sleepingowl:update
```

Silent fallback на unversioned legacy path не используется.
