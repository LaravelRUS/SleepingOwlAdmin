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

Legacy aliases из старого опубликованного config пока нормализуются отдельным следующим пунктом. Поэтому Composer dependency удаляется только после config compatibility fixture и проверки, что `src`, resources и stubs больше не загружают `KodiCMS\Assets`.
