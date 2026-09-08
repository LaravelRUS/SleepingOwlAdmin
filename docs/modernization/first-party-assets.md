# First-party asset foundation

## Границы слоя

`SleepingOwl\Admin\Assets` содержит небольшой framework-facing слой без зависимости от `kodicms/laravel-assets`:

- `Asset` хранит handle, source, dependencies, placement и HTML attributes;
- `AssetDependencySorter` стабильно упорядочивает зарегистрированные handles;
- `AssetRegistry` хранит scripts/styles, заменяет дубликаты последней регистрацией и разделяет head/footer;
- `AssetPackage` и `AssetPackageRegistry` описывают переиспользуемые наборы и раскрывают package dependencies;
- `HtmlAttributes`, `AssetRenderer` и `MetaRenderer` отвечают только за безопасный HTML output.

Manifest classes остаются отдельной подсистемой. `AssetManifestResolver` преобразует logical ids в versioned URL, но не регистрирует assets, не сортирует пользовательские зависимости и не рендерит HTML.

## Compatibility policy

- неизвестный asset/package dependency не удаляет зарегистрированный элемент;
- циклическая asset dependency не приводит к бесконечному циклу: элементы сохраняются в стабильном порядке регистрации;
- повторная регистрация handle/package заменяет значение;
- пользовательские attributes сохраняются и экранируются на HTML boundary;
- CSS получает прежние defaults `media=all`, `type=text/css`, `rel=stylesheet` при render;
- scripts из head и footer сортируются независимо.

## Public adapters

`Templates\Assets` и `Templates\Meta` используют foundation через композицию и сохраняют узкие `AssetsInterface`/`MetaInterface`. Container keys `assets`, `assets.packages` и `sleeping_owl.meta` оставлены для совместимости, но теперь указывают только на first-party services. Facades находятся в `SleepingOwl\Admin\Facades`; installation stub импортирует их явно и не зависит от опубликованного списка aliases.

Проверенный no-build consumer recipe для `MetaInterface::addCss()`/`addJs()`, гарантированного порядка после выбранной темы и хранения application files вне package-owned publish root приведён в [`theme-customization.md`](theme-customization.md).

Default config указывает на first-party facades. `AssetAliasNormalizer` заменяет только три точных legacy-значения `KodiCMS\Assets\Facades\Assets`, `Meta` и `PackageManager` в старом опубликованном config; имена aliases и любые пользовательские facade classes не меняются. Нормализованный массив сохраняется обратно в runtime config до регистрации Laravel aliases.

`kodicms/laravel-assets` удалён из Composer dependency tree. Для прямых imports в
application code используются следующие first-party replacements:

| Старый import | Replacement |
| --- | --- |
| `KodiCMS\Assets\Facades\Assets` | `SleepingOwl\Admin\Facades\Assets` |
| `KodiCMS\Assets\Facades\Meta` | `SleepingOwl\Admin\Facades\Meta` |
| `KodiCMS\Assets\Facades\PackageManager` | `SleepingOwl\Admin\Facades\PackageManager` |

Строки старых facades в опубликованном config можно оставить на время обновления:
точный normalizer заменит их при загрузке. Новый код должен импортировать
first-party facades или соответствующие contracts напрямую.
